import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/prisma';
import { PRODUCT_UNITS, SORTS } from '$lib/consts';

export const load: PageServerLoad = async ({ params, url }) => {
	const slug: any = params.category_slug;
	const filterByProperties = url.searchParams.getAll('pr')
		? url.searchParams.getAll('pr').map((i) => {
				return { id: Number(i) };
		  })
		: [];
	const filterByUnits = url.searchParams.getAll('unit') || [];
	const getCategory = async () => {
		const category = [];
		// slug
		// ? await db.category.findUnique({
		// 		where: {
		// 			slug: slug,
		// 			status: true
		// 		},
		// 		select: {
		// 			id: true,
		// 			name: true,
		// 			slug: true,
		// 			desc: true,
		// 			products: {
		// 				where: {
		// 					status: 'active'
		// 				},
		// 				include: {
		// 					properties: { select: { property: true } }
		// 				}
		// 			}
		// 		}
		//   })
		// : null;

		if (slug && !category) throw error(404, 'Category not found.');

		return JSON.parse(JSON.stringify(category));
	};

	var category = await getCategory();

	var filters = [];

	var properties: { id: number; name: string }[] = [];
	category.products.forEach((product: { properties: any[] }) => {
		if (product.properties.length > 0) {
			product.properties.forEach((property) => {
				properties.push(property.property);
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
			id: category.id,
			name: category.name,
			slug: category.slug,
			desc: category.desc
		},
		filters,
		sorts: SORTS
	};
};
