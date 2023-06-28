import { error } from '@sveltejs/kit';
import { db } from '$lib/server/prisma';

export const load = async ({ url }) => {
	const getOrders = async () => {
		const page = Number(url.searchParams.get('page') || 1);
		const limit = 15;

		const orders = await db.order.paginate().withPages({
			limit: limit,
			page: page,
			includePageCount: true
		});

		if (!orders) {
			throw error(404, 'Orders not found');
		}

		return JSON.parse(JSON.stringify(orders));
	};

	return { orders: await getOrders() };
};
