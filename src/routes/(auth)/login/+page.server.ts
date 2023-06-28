import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia-auth';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
	const session = await locals.auth.validate();
	if (session) {
		const redirectTo = url.searchParams.get('redirectTo');
		if (redirectTo) {
			throw redirect(302, `/${redirectTo.slice(1)}`);
		}
		throw redirect(302, '/');
	}
};

export const actions = {
	default: async ({ request, locals }) => {
		const { email, password } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>;
		if (typeof email !== 'string' || typeof password !== 'string') return fail(400);
		try {
			const key = await auth.useKey('email', email, password);
			const session = await auth.createSession(key.userId);
			locals.auth.setSession(session);
		} catch (err) {
			if (err instanceof LuciaError) {
				if (err.message === 'AUTH_INVALID_KEY_ID') {
					return fail(400, {
						error: 'You are not registered'
					});
				}
				return fail(400, {
					error: err.message
				});
			}

			console.error(err);
			return fail(400, { message: 'Could not login user.' });
		}
	}
};
