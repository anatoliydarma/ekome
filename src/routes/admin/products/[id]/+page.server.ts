import { db } from '$lib/server/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { PRODUCT_STATUSES, PRODUCT_UNITS, BRANDS, COUNTRIES, GST } from '$lib/consts';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';

const productSchema = z.object({
	// See https://zod.dev/?id=primitives for schema syntax
	id: z.number().nullable(),
	name: z.string(),
	slug: z.string().optional(),
	desc: z.string().optional().default('').nullable(),
	sku: z.string().optional().default('').nullable(),
	upc: z.coerce.number().optional().default(0).nullable(),
	unit: z.string().default('PIECES'),
	price: z.coerce.number().multipleOf(0.01).optional().default(0),
	gst: z.number(),
	min_qty: z.coerce.number().optional(),
	status: z.string().default('DRAFT'),
	category_id: z.number(),
	images: z.string().array().optional().nullable(),
	properties: z
		.object({
			id: z.number().int().min(1),
			name: z.string().min(2)
		})
		.array()
		.optional(),
	brand: z.string().optional().nullable(),
	country: z.string().optional().nullable(),
	weight: z.coerce.number().optional().default(0).nullable()
});

export const load = async ({ params }) => {
	let id: any = Number(params.id);
	id = Number.isInteger(id) ? id : null;

	let product = id
		? await db.product.findUnique({
				where: {
					id: id
				},
				include: {
					properties: { select: { property: true } }
				}
		  })
		: null;

	if (id && !product) throw error(404, 'product not found.');

	if (product) {
		product.properties = product?.properties.map(function (property: {
			property: any;
			id: any;
			name: any;
		}) {
			return { id: property.property.id, name: property.property.name };
		});
	}

	const form = await superValidate(JSON.parse(JSON.stringify(product)), productSchema);

	const categories = await db.category.findMany({
		select: {
			id: true,
			name: true
		}
	});

	const properties = await db.property.findMany();

	return {
		form,
		categories,
		properties,
		productStatuses: PRODUCT_STATUSES,
		units: PRODUCT_UNITS,
		brands: BRANDS,
		countries: COUNTRIES,
		gst: GST
	};
};

export const actions = {
	save: async (event) => {
		const formData = await event.request.formData();
		const form = await superValidate(formData, productSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		let images =
			form.data.images && form.data.images.length > 0 ? form.data.images.toString().split(',') : [];

		let properties = form.data.properties ? form.data.properties : [];

		try {
			if (!form.data.id) {
				await db.product.create({
					data: {
						name: form.data.name,
						status: form.data.status,
						desc: form.data.desc,
						sku: form.data.sku,
						upc: form.data.upc,
						unit: form.data.unit,
						price: form.data.price,
						gst: form.data.gst,
						min_qty: form.data.min_qty,
						category_id: form.data.category_id,
						images: images.length > 0 ? images.toString().split(',') : [],
						properties: {
							create: properties.map((property) => ({
								property: { connect: { id: property.id } }
							}))
						},
						brand: form.data.brand,
						country: form.data.country
					}
				});
			} else {
				await db.product.update({
					where: {
						id: form.data.id
					},
					data: {
						name: form.data.name,
						status: form.data.status,
						desc: form.data.desc,
						sku: form.data.sku,
						upc: form.data.upc,
						unit: form.data.unit,
						price: form.data.price,
						gst: form.data.gst,
						min_qty: form.data.min_qty,
						category_id: form.data.category_id,
						images: images.length > 0 ? images.toString().split(',') : [],
						brand: form.data.brand,
						country: form.data.country
					}
				});

				if (properties) {
					await db.product.update({
						where: {
							id: form.data.id
						},
						data: {
							properties: {
								deleteMany: {},
								create: properties.map((property) => ({
									property: { connect: { id: property.id } }
								}))
							}
						}
					});
				}
			}
		} catch (e) {
			console.error(e);
		}

		throw redirect(303, '/admin/products');
	},

	delete: async ({ request }) => {
		const values = await request.formData();
		const id = !isNaN(Number(values.get('id'))) ? Number(values.get('id')) : undefined;
		try {
			const deleteUser = await db.product.delete({
				where: {
					id: id
				}
			});
		} catch (e) {
			console.error(e);

			return fail(400, { e });
		}

		throw redirect(303, '/admin/products');
	}
};
