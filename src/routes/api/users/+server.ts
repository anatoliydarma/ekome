import { json } from '@sveltejs/kit';

export const GET = async ({ url }) => {
	const search: string | undefined = url.searchParams.get('search') || undefined;

	const users = [];
	// 	await db.authUser.findMany({
	// 	where: {
	// 		active: true,
	// 		name: {
	// 			search: `${search}:*`
	// 		},
	// 		email: {
	// 			search: `${search}:*`
	// 		},
	// 		phone: {
	// 			search: `${search}:*`
	// 		}
	// 	},
	// 	select: {
	// 		id: true,
	// 		name: true,
	// 		email: true,
	// 		phone: true
	// 	}
	// });

	return json(users);
};
