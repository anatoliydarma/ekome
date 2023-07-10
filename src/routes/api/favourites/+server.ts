import { db } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';

export const GET = async ({ locals }) => {
	const user = {}; //await locals.auth.validateUser();
	const favourites = await db.favourites.findMany({
		where: {
			user_id: user?.id
		},
		include: {
			product: {
				select: {
					name: true,
					slug: true,
					price: true,
					images: true,
					category: {
						select: {
							slug: true
						}
					}
				}
			}
		}
	});

	return json({ favourites });
};
