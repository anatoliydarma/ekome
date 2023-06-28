import { db } from '$lib/server/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';

const categorySchema = z.object({
	// See https://zod.dev/?id=primitives for schema syntax
	id: z.number().nullable(),
	name: z.string(),
	slug: z.string().optional(),
	desc: z.string().optional().default(''),
	sort: z.number().optional().default(1),
	status: z.boolean(),
	image: z.string().array().optional()
});

export const load = async ({ params }) => {
	let id: any = Number(params.id);
	id = Number.isInteger(id) ? id : undefined;
	const category = id
		? await db.category.findUnique({
				where: {
					id: id
				}
		  })
		: null;

	if (id && !category) throw error(404, 'Category not found.');

	const form = await superValidate(category, categorySchema);
	return { form };
};

export const actions = {
	save: async (event) => {
		const form = await superValidate(event, categorySchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		let image = form.data.image && form.data.image[0].length > 0 ? form.data.image : [];

		try {
			if (!form.data.id) {
				await db.category.create({
					data: {
						name: form.data.name,
						status: form.data.status,
						desc: form.data.desc,
						sort: form.data.sort,
						image: image
					}
				});
			} else {
				await db.category.update({
					where: {
						id: form.data.id
					},
					data: {
						name: form.data.name,
						status: form.data.status,
						desc: form.data.desc,
						sort: form.data.sort,
						image: image
					}
				});
			}
		} catch (e) {
			return fail(400, { e });
		}

		throw redirect(303, '/admin/categories');
	},

	delete: async ({ request }) => {
		const values = await request.formData();
		const id = !isNaN(Number(values.get('id'))) ? Number(values.get('id')) : undefined;
		try {
			const deleteUser = await db.category.delete({
				where: {
					id: id
				}
			});
		} catch (e) {
			console.error(e);

			return fail(400, { e });
		}

		throw redirect(303, '/admin/categories');
	}
};
