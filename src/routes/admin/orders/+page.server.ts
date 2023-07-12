import { error } from '@sveltejs/kit';

export const load = async ({ url, locals }) => {
	const getOrders = async () => {
		const page = Number(url.searchParams.get('page') || 1);
		const limit = 15;

		const orders = await locals.pb.collection('orders').getList(page, limit, {
			sort: '-created,id'
		});

		if (!orders) {
			throw error(404, 'Orders not found');
		}

		return JSON.parse(JSON.stringify(orders));
	};

	return { orders: await getOrders() };
};
