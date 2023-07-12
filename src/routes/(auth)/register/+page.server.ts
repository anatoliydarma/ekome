import { fail, redirect } from '@sveltejs/kit';
import { emailVerificationToken, sendEmail, serializeNonPOJOs } from '$lib/server/utils';
import { PUBLIC_DOMAIN } from '$env/static/public';
import { userSchema } from '$lib/zod';
import { setError, superValidate } from 'sveltekit-superforms/server';

const signUpSchema = userSchema.pick({
	email: true,
	password: true,
	passwordConfirm: true
});

export const load = async (event) => {
	if (event.locals.pb.authStore.isValid) {
		throw redirect(303, '/');
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
		form.data.passwordConfirm = form.data.password;
		try {
			await event.locals.pb.collection('users').create(form.data);

			await event.locals.pb
				.collection('users')
				.authWithPassword(form.data.email, form.data.password);
			await event.locals.pb.collection('users').requestVerification(form.data.email);
		} catch (err) {
			console.error(err);

			return setError(form, 'email', err.response.message);

			// if (
			// 	err instanceof Prisma.PrismaClientKnownRequestError &&
			// 	err.code === 'P2002' &&
			// 	err.message?.includes('email')
			// ) {
			// 	return setError(form, 'email', 'A user with this email already exists.');
			// }

			// if (err instanceof LuciaError && err.message === 'AUTH_DUPLICATE_KEY_ID') {
			// 	return setError(form, 'email', 'A user with this email already exists.');
			// }
			// console.error(err);
			// return fail(500, {
			// 	error: 'Unknown error occurred'
			// });
		}

		return { form };
	}
};
