import { json } from '@sveltejs/kit';
// import { db, getPopularProducts, getProducts } from '$lib/server/prisma';
import { getCostOfProduct, getOrderByProduct } from '$lib/server/utils';

export const GET = async ({ url }) => {
	let data = null;

	const search: string | undefined = url.searchParams.get('search') || undefined;
	const paginate: number = url.searchParams.get('paginate')
		? Number(url.searchParams.get('paginate'))
		: 1;

	if (paginate === 0) {
		const getProducts = async () => {
			const products = [];
			// 	await db.product.findMany({
			// 	where: {
			// 		status: 'active',
			// 		name: {
			// 			search: `${search}:*`
			// 		},
			// 		desc: {
			// 			search: `${search}:*`
			// 		}
			// 	}
			// });

			return JSON.parse(JSON.stringify(products));
		};

		let products = await getProducts();
		data = products.map(function (p: Product) {
			p.price = getCostOfProduct(p);
			return p;
		});
	} else {
		const slug: string | undefined = url.searchParams.get('slug') || undefined;
		const cursor = Number(url.searchParams.get('p')) || 0;
		const sortBy = getOrderByProduct(url.searchParams.get('sortBy') || '-created_at');
		const take = 16;
		const filterByProperties = url.searchParams.getAll('pr').map((i) => {
			return { id: Number(i) };
		});
		const filterByUnits = url.searchParams.getAll('unit');

		let { products, count } = {};
		// 	await getProducts({
		// 	slug,
		// 	cursor,
		// 	search,
		// 	filterByProperties,
		// 	filterByUnits,
		// 	sortBy,
		// 	take
		// });

		const found = products?.length > 0 ? true : false;

		let prepareProducts = products;
		if (!found && search) {
			//	prepareProducts = await getPopularProducts({ take: 5 });
		}

		prepareProducts = prepareProducts.map(function (p: Product) {
			p.price = getCostOfProduct(p);
			return p;
		});

		data = {
			products: prepareProducts,
			p: products.length ? products[products.length - 1].id : 0,
			found: found,
			count: count ? count : null,
			end: cursor != 0 && !found ? true : false
		};
	}

	return json(data);
};
