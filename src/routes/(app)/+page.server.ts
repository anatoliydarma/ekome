import { error } from '@sveltejs/kit';

export const load = async () => {
	const getCategories = async () => {
		// const categories = await db.category.findMany({
		// 	where: {
		// 		status: true
		// 	}
		// });

		// if (!categories) {
		// 	throw error(404, 'Categories not found');
		// }

		return []; //categories;
	};

	return { categories: getCategories() };
};
