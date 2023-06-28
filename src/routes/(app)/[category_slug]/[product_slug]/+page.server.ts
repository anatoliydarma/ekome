import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/prisma';
import { getCostOfProduct } from '$lib/server/utils';

export const load: PageServerLoad = async ({ params }) => {
	let slug: any = params.product_slug;

	const getProduct = async () => {
		const product = slug
			? await db.product.findUnique({
					where: {
						slug: slug,
						status: 'active'
					},
					include: {
						category: {
							select: {
								name: true,
								slug: true
							}
						}
					}
			  })
			: null;

		if (slug && !product) throw error(404, 'product not found.');

		return JSON.parse(JSON.stringify(product));
	};

	const product = await getProduct();

	const getRelatedProducts = async () => {
		const products = await db.product.findMany({
			orderBy: {
				popularity: 'desc'
			},
			where: {
				NOT: {
					id: product.id
				},
				status: 'active',
				category: {
					is: {
						slug: product?.category.slug
					}
				}
			},
			select: {
				name: true,
				slug: true,
				price: true,
				images: true
			},
			take: 4
		});

		return JSON.parse(JSON.stringify(products));
	};

	product.price = getCostOfProduct(product);

	return {
		product: product,
		streamed: {
			relatedProducts: await getRelatedProducts()
		}
	};
};
