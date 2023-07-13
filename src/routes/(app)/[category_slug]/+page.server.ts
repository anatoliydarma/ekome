import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { PRODUCT_UNITS, SORTS } from '$lib/consts';
import { serializeNonPOJOs } from '$lib/server/utils';

export const load: PageServerLoad = async ({ params, url, locals }) => {
	const slug: any = params.category_slug;
	const filterByProperties = url.searchParams.getAll('pr')
		? url.searchParams.getAll('pr').map((i) => {
				return { id: Number(i) };
		  })
		: [];
	const filterByUnits = url.searchParams.getAll('unit') || [];
	const getCategory = async () => {
		const category = await locals.pb.collection('categories').getList(1, 1, {
			filter: `slug="${slug}"`
		});

		const products = await locals.pb.collection('products').getFullList({
			filter: `category="${category.items[0].id}"`,
			expand: 'properties'
		});

		if (slug && !category) throw error(404, 'Category not found.');

		return { category: serializeNonPOJOs(category), products: serializeNonPOJOs(products) };
	};

	var { category, products } = await getCategory();

	var filters = [];

	var properties: { id: number; name: string }[] = [];

	products.forEach((product: Product) => {
		if (Object.keys(product.expand).length > 0 && product.expand.properties.length > 0) {
			product.expand.properties.forEach((property) => {
				properties.push({ id: property.id, name: property.name });
			});
		}
	});
	properties = [...new Map(properties.map((item) => [item['id'], item])).values()];

	filters.push({
		name: 'properties',
		items: properties
	});

	filters.push({
		name: 'units',
		items: PRODUCT_UNITS
	});

	return {
		category: {
			id: category.items[0].id,
			name: category.items[0].name,
			slug: category.items[0].slug,
			desc: category.items[0].desc
		},
		filters,
		sorts: SORTS
	};
};
