import { db } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
	const { user } = await locals.auth.validateUser();
	const getUserOrder = async () => {
		const userOrder = user?.id
			? await db.order.findUnique({
					where: {
						id: Number(params?.order_id),
						user_id: user.id,
						status: 'processing'
					},
					include: {
						items: {
							include: {
								product: {
									select: {
										name: true,
										images: true
									}
								}
							}
						}
					}
			  })
			: null;

		return JSON.parse(JSON.stringify(userOrder));
	};

	const order = await getUserOrder();

	if (order && order?.id) {
		return { order };
	} else {
		throw redirect(303, '/');
	}
};
