import { db } from '$lib/server/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { propertySchema } from '$lib/zod';

export const ssr = false;

export const load = async ({ params }) => {
	let id: any = Number(params.id);
	id = Number.isInteger(id) ? id : undefined;
	const property = id
		? await db.property.findUnique({
				where: {
					id: id
				}
		  })
		: null;

	if (id && !property) throw error(404, 'Property not found.');

	const form = await superValidate(property, propertySchema);
	return { form };
};

export const actions = {
	save: async (event) => {
		const form = await superValidate(event, propertySchema);

		form.data.id = Number.isInteger(form.data.id) ? form.data.id : null;
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			if (!form.data.id) {
				await db.property.create({
					data: {
						name: form.data.name
					}
				});
			} else {
				await db.property.update({
					where: {
						id: form.data.id
					},
					data: {
						name: form.data.name
					}
				});
			}
		} catch (e) {
			return fail(400, { e });
		}

		throw redirect(303, '/admin/properties');
	},

	delete: async ({ request }) => {
		const values = await request.formData();
		const id = !isNaN(Number(values.get('id'))) ? Number(values.get('id')) : undefined;
		try {
			const deleteUser = await db.property.delete({
				where: {
					id: id
				}
			});
		} catch (e) {
			console.error(e);

			return fail(400, { e });
		}

		throw redirect(303, '/admin/properties');
	}
};
