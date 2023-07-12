import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { categorySchema } from '$lib/zod';
import { getUniqueSlug } from '$lib/server/utils';

export const load = async ({ params, locals }) => {
	let id: string | undefined = params.id ? params.id : undefined;
	const category = id ? await locals.pb.collection('categories').getOne(id) : null;

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

		// let image = form.data.image && form.data.image[0].length > 0 ? form.data.image : null;
		// form.data.image = image;
		try {
			if (!form.data.id) {
				form.data.slug = await getUniqueSlug(form.data.name, 'categories');

				await event.locals.pb.collection('categories').create(form.data);
			} else {
				await event.locals.pb.collection('categories').update(form.data.id, form.data);
			}
		} catch (e) {
			return fail(400, { e });
		}

		throw redirect(303, '/admin/categories');
	},

	delete: async ({ request, locals }) => {
		const values = await request.formData();
		const id = values.get('id') ? values.get('id') : undefined;
		try {
			if (id) {
				await locals.pb.collection('categories').delete(id);
			}
		} catch (e) {
			console.error(e);

			return fail(400, { e });
		}

		throw redirect(303, '/admin/categories');
	}
};
