import { db } from '$lib/server/prisma';

export const load = async ({ url }) => {
	const getOrders = async () => {
		const ordersCount = await db.order.count();

		return ordersCount;
	};

	return { ordersCount: getOrders() };
};
