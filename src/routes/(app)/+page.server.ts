import { serializeNonPOJOs } from '$lib/server/utils';
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const getCategories = async () => {
		const categories = await locals.pb.collection('categories').getFullList({
			sort: 'created,id'
		});

		if (!categories) {
			throw error(404, 'Categories not found');
		}

		return serializeNonPOJOs(categories);
	};

	return { categories: getCategories() };
};
