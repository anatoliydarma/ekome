import { error } from '@sveltejs/kit';

export const load = async ({ url, locals }) => {
	const getProducts = async () => {
		const page = Number(url.searchParams.get('page') || 1);
		const limit = 15;

		const products = await locals.pb.collection('products').getList(page, limit, {
			sort: '-created,id'
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
