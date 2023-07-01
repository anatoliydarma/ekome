import { db } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';

export const GET = async ({ params, locals }) => {
	let { user } = await locals.auth.validateUser();
	if (!user) {
		return json({ isFavourite: false });
	}

	const favourite = await db.favourites.findFirst({
		where: {
			product_id: Number(params.product_id),
			user_id: user.id
		}
	});

	return json({ isFavourite: favourite ? true : false });
};

export const POST = async ({ params, request, locals }) => {
	const { isFavourite } = await request.json();
	let { user } = await locals.auth.validateUser();

	if (isFavourite) {
		await db.favourites.delete({
			where: { product_id_user_id: { product_id: Number(params.product_id), user_id: user?.id } }
		});

		return json({ isFavourite: false });
	} else {
		await db.favourites.create({
			data: {
				product_id: Number(params.product_id),
				user_id: user?.id
			}
		});

		return json({ isFavourite: true });
	}
};
