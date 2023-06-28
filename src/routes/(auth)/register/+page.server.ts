import { auth } from '$lib/server/lucia';
import { Prisma } from '@prisma/client';
import { LuciaError } from 'lucia-auth';
import { fail, redirect } from '@sveltejs/kit';
import { emailVerificationToken, sendEmail } from '$lib/server/utils';
import { PUBLIC_DOMAIN } from '$env/static/public';
import { userSchema } from '$lib/zod';
import { setError, superValidate } from 'sveltekit-superforms/server';

const signUpSchema = userSchema.pick({
	email: true,
	password: true
});

export const load = async (event) => {
	const session = await event.locals.auth.validate();
	if (session) {
		throw redirect(302, '/');
	}

	const form = await superValidate(event, signUpSchema);
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, signUpSchema);

		//console.log('form', form);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const user = await auth.createUser({
				primaryKey: {
					providerId: 'email',
					providerUserId: form.data.email,
					password: form.data.password
				},
				attributes: {
					email: form.data.email,
					role: 'client',
					email_verified: false
				}
			});

			const token = await emailVerificationToken.issue(user.id);

			const session = await auth.createSession(user.id);
			event.locals.auth.setSession(session);

			// url to verify tokens
			const url = `${PUBLIC_DOMAIN}/verify-email?token=${token.toString()}`;

			sendEmail(user.email, 'Verify email', 'verify-email', url);
		} catch (err) {
			if (
				err instanceof Prisma.PrismaClientKnownRequestError &&
				err.code === 'P2002' &&
				err.message?.includes('email')
			) {
				return setError(form, 'email', 'A user with this email already exists.');
			}

			if (err instanceof LuciaError && err.message === 'AUTH_DUPLICATE_KEY_ID') {
				return setError(form, 'email', 'A user with this email already exists.');
			}
			console.error(err);
			return fail(500, {
				error: 'Unknown error occurred'
			});
		}

		return { form };
	}
};
