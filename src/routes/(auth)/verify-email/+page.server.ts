import { auth } from '$lib/server/lucia';
import { error } from '@sveltejs/kit';
import { emailVerificationToken, sendEmail } from '$lib/server/utils';
import { LuciaTokenError } from '@lucia-auth/tokens';
import { PUBLIC_DOMAIN } from '$env/static/public';

export const load = async (event) => {
	const tokenParams = event.url.searchParams.get('token');
	const { user } = await event.locals.auth.validateUser();

	if (user && user.email_verified) {
		return { user };
	}

	if (tokenParams) {
		try {
			const token = await emailVerificationToken.validate(tokenParams);
			await auth.updateUserAttributes(token.userId, {
				email_verified: true
			});
			await auth.invalidateAllUserSessions(token.userId);
			const session = await auth.createSession(token.userId);
			event.locals.auth.setSession(session);

			const { user } = await event.locals.auth.validateUser();
			return { user };
		} catch (e) {
			if (e instanceof LuciaTokenError && e.message === 'EXPIRED_TOKEN') {
				throw error(404, {
					message: 'expired token/link'
				});
			}
			if (e instanceof LuciaTokenError && e.message === 'INVALID_TOKEN') {
				throw error(404, {
					message: 'invalid link'
				});
			}
		}
	}

	return { user };
};

export const actions = {
	default: async (event) => {
		const { user } = await event.locals.auth.validateUser();

		if (user) {
			const token = await emailVerificationToken.issue(user.id);
			const url = `${PUBLIC_DOMAIN}/verify-email?token=${token.toString()}`;

			let email: string = '';
			await event
				.fetch(`/api/users/${user.id}`, {
					method: 'get',
					headers: {
						'Content-Type': 'application/json'
					}
				})
				.then((res) => res.json())
				.then((data) => {
					email = data.email;
				});

			await sendEmail(email, 'Verify email', 'verify-email', url);

			return { success: true };
		}

		return { success: false };
	}
};
