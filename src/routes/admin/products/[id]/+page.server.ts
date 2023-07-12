import { error, fail, redirect } from '@sveltejs/kit';
import { PRODUCT_STATUSES, PRODUCT_UNITS, BRANDS, COUNTRIES, GST } from '$lib/consts';
import { superValidate } from 'sveltekit-superforms/server';
import { productSchema } from '$lib/zod';

export const load = async ({ params, locals }) => {
	let id: any = Number(params.id);
	id = Number.isInteger(id) ? id : null;

	let product = id
		? await locals.pb.collection('products').getOne(id, {
				expand: 'properties'
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

	const categories = await locals.pb.collection('categories').getFullList({
		sort: '-created'
	});

	const properties = await locals.pb.collection('properties').getFullList({
		sort: '-created'
	});

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
				await event.locals.pb.collection('products').create({
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
					country: form.data.country,
					properties: properties.map((property) => property.id)
				});
			} else {
				await event.locals.pb.collection('products').update(form.data.id, {
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
					country: form.data.country,
					properties: properties.map((property) => property.id)
				});
			}
		} catch (e) {
			console.error(e);
		}

		throw redirect(303, '/admin/products');
	},

	delete: async ({ request, locals }) => {
		const values = await request.formData();
		const id = values.get('id');
		try {
			const deleteUser = id ? await locals.pb.collection('products').delete(id) : null;
		} catch (e) {
			console.error(e);

			return fail(400, { e });
		}

		throw redirect(303, '/admin/products');
	}
};
