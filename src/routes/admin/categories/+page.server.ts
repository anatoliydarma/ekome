import { error } from '@sveltejs/kit';

export const load = async ({ url, locals }) => {
	const getCategories = async () => {
		const page = Number(url.searchParams.get('page') || 1);
		const limit = 15;

		const categories = await locals.pb.collection('categories').getList(page, limit, {
			sort: '-created,id'
		});

		if (!categories) {
			throw error(404, 'Categories not found');
		}

		return JSON.parse(JSON.stringify(categories));
	};

	return { categories: await getCategories() };
};
