import { error } from '@sveltejs/kit';

export const ssr = false;

export const load = async ({ url }) => {
	const getProperties = async () => {
		const page = Number(url.searchParams.get('page') || 1);
		const limit = 15;

		const properties = {};

		// 	await db.property.paginate().withPages({
		// 	limit: limit,
		// 	page: page,
		// 	includePageCount: true
		// });

		if (!properties) {
			throw error(404, 'Properties not found');
		}

		return JSON.parse(JSON.stringify(properties));
	};

	return { properties: getProperties() };
};
