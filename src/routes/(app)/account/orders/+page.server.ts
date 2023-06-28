import { db } from '$lib/server/prisma';

export const load = async ({ locals }) => {
	const { user } = await locals.auth.validateUser();
	const getUserOrders = async () => {
		const userOrders = user?.id
			? await db.authUser.findUnique({
					where: {
						id: user.id
					},
					select: {
						orders: {
							include: {
								items: {
									include: {
										product: {
											select: {
												name: true
											}
										}
									}
								}
							}
						}
					}
			  })
			: null;

		return JSON.parse(JSON.stringify(userOrders));
	};

	return { user: getUserOrders() };
};
