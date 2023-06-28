import { error } from '@sveltejs/kit';
import { db } from '$lib/server/prisma';

export const load = async ({ url }) => {
	const getProducts = async () => {
		const page = Number(url.searchParams.get('page') || 1);
		const limit = 15;

		const products = await db.product
			.paginate({
				include: {
					category: {
						select: {
							name: true
						}
					}
				},
				orderBy: {
					id: 'desc'
				}
			})
			.withPages({
				limit: limit,
				page: page,
				includePageCount: true
			});

		if (!products) {
			throw error(404, 'Products not found');
		}
		return JSON.parse(JSON.stringify(products));
	};

	return {
		products: await getProducts()
	};
};
