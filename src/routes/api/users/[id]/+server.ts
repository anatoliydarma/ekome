import { db } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';

export const GET = async ({ params }) => {
	const user = await db.authUser.findUnique({
		where: {
			id: params.id
		},
		select: {
			id: true,
			email: true,
			name: true,
			phone: true,
			role: true,
			email_verified: true
		}
	});
	return json(user);
};
