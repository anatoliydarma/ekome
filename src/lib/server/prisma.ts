import { PrismaClient } from '@prisma/client';
import pagination from 'prisma-extension-pagination';
import slugify from 'slugify';
import camelCase from 'camelcase';
import { dev } from '$app/environment';
import { getName } from './utils';

const db =
	global.__prisma__ ||
	new PrismaClient({
		errorFormat: 'pretty'
	}).$extends(pagination);

if (dev) {
	global.__prisma__ = db;
}

db.$extends({
	name: `slug`
	// TODO check unique slug
	// source(params) {
	// 	return getName(params.args.data.name, params.args.data.name_2);
	// },
	// async slugify(source, params) {
	// 	const method = camelCase(params.model);

	// 	const collection = db[method];
	// 	let slug = slugify(getName(params.args.data.name, params.args.data.name_2), {
	// 		lower: true,
	// 		strict: true,
	// 		remove: /[*+~.()'"!:@]/g
	// 	});

	// 	let attempt = 0;

	// 	while ((await collection.count({ where: { slug } })) > 0) {
	// 		attempt += 1;
	// 		slug = `${slug}-${attempt}`;
	// 	}

	// 	return slug;
	// }
});

const getProducts = async (params: any) => {
	let products;

	let count = null;

	if (params.cursor == 0) {
		products = await db.product.findMany({
			take: params.take,
			where: {
				status: 'active',
				category: {
					is: {
						slug: params.slug
					}
				},
				unit:
					params.filterByUnits.length > 0
						? {
								in: params.filterByUnits
						  }
						: {},
				properties:
					params.filterByProperties.length > 0
						? {
								some: {
									property_id: { in: params.filterByProperties.map((i: any) => i.id) }
								}
						  }
						: {},
				name: params.search
					? {
							search: `${params.search}:*`
					  }
					: {}
			},
			include: {
				properties: { select: { property: true } },
				category: { select: { slug: true } }
			},
			orderBy: [
				{
					[params.sortBy.key]: params.sortBy.sort
				}
			]
		});

		count = await db.product.count({
			where: {
				status: 'active',
				category: {
					is: {
						slug: params.slug
					}
				},
				unit:
					params.filterByUnits.length > 0
						? {
								in: params.filterByUnits
						  }
						: {},
				properties:
					params.filterByProperties.length > 0
						? {
								some: {
									property_id: { in: params.filterByProperties.map((i: any) => i.id) }
								}
						  }
						: {},
				name: params.search
					? {
							search: `${params.search}:*`
					  }
					: {}
			}
		});
	} else {
		products = await db.product.findMany({
			take: params.take,
			skip: 1,
			cursor: {
				id: params.cursor
			},
			where: {
				status: 'active',
				category: {
					is: {
						slug: params.slug
					}
				},
				unit:
					params.filterByUnits.length > 0
						? {
								in: params.filterByUnits
						  }
						: {},
				properties:
					params.filterByProperties.length > 0
						? {
								some: {
									property_id: { in: params.filterByProperties.map((i: any) => i.id) }
								}
						  }
						: {},
				name: params.search
					? {
							search: `${params.search}:*`
					  }
					: {}
			},
			include: {
				properties: { select: { property: true } },
				category: { select: { slug: true } }
			},
			orderBy: [
				{
					[params.sortBy.key]: params.sortBy.sort
				}
			]
		});
	}

	return {
		products,
		count: count ? count : null
	};
};

const countProducts = async (params: any) => {
	return await db.product.count({
		where: {
			status: 'active',
			category: {
				is: {
					slug: params.slug
				}
			},
			unit:
				params.filterByUnits.length > 0
					? {
							in: params.filterByUnits
					  }
					: {},
			properties:
				params.filterByProperties.length > 0
					? {
							some: {
								property_id: { in: params.filterByProperties.map((i: any) => i.id) }
							}
					  }
					: {},
			name: params.search
				? {
						search: `${params.search}:*`
				  }
				: {},
			desc: params.search
				? {
						search: `${params.search}:*`
				  }
				: {}
		}
	});
};

const getPopularProducts = async (params: any) => {
	return await db.product.findMany({
		orderBy: {
			popularity: 'desc'
		},
		where: {
			status: 'active'
		},
		select: {
			name: true,
			slug: true,
			price: true,
			images: true,
			gst: true,
			category: { select: { slug: true } }
		},
		take: params.take
	});
};

export { db, getProducts, getPopularProducts, countProducts };
