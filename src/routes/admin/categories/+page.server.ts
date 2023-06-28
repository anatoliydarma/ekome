import { error } from '@sveltejs/kit';
import { db } from '$lib/server/prisma';

export const load = async ({ url }) => {
	const getCategories = async () => {
		const page = Number(url.searchParams.get('page') || 1);
		const limit = 15;

		const categories = await db.category.paginate().withPages({
			limit: limit,
			page: page,
			includePageCount: true
		});

		if (!categories) {
			throw error(404, 'Categories not found');
		}

		return JSON.parse(JSON.stringify(categories));
	};

	return { categories: await getCategories() };
};
