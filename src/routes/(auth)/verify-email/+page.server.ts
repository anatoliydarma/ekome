import { sendEmail } from '$lib/server/utils';

export const load = async (event) => {
	const tokenParams = event.url.searchParams.get('token');
	const user = event.locals.user;

	if (user && user.verified) {
		return { user: user };
	}

	if (tokenParams) {
		try {
			await event.locals.pb.collection('users').confirmVerification(tokenParams);
			await event.locals.pb.collection('users').authRefresh();
			return { user: user };
		} catch (e) {
			console.error(e);

			// TODO
			// if (e instanceof LuciaTokenError && e.message === 'EXPIRED_TOKEN') {
			// 	throw error(404, {
			// 		message: 'expired token/link'
			// 	});
			// }
			// if (e instanceof LuciaTokenError && e.message === 'INVALID_TOKEN') {
			// 	throw error(404, {
			// 		message: 'invalid link'
			// 	});
			// }
		}
	}
};

export const actions = {
	default: async (event) => {
		const user = event.locals.user;

		if (user) {
			await event.locals.pb.collection('users').requestVerification(user.email);

			return { success: true };
		}

		return { success: false };
	}
};
