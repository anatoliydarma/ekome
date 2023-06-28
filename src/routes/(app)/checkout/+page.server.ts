import { handleLoginRedirect } from '$lib/utils';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	let { user } = await event.locals.auth.validateUser();
	if (!user && !user?.email_verified) {
		throw redirect(302, handleLoginRedirect(event));
	}

	return { user };
};
