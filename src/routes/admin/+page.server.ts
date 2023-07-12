export const load = async ({ locals }) => {
	const getOrders = async () => {
		const ordersCount = await locals.pb.collection('orders').getFullList();

		return ordersCount.length;
	};

	return { ordersCount: getOrders() };
};
