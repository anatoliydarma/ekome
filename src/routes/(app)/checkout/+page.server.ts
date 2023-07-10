import { handleLoginRedirect } from '$lib/client/utils';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const user = {}; //await locals.auth.validateUser();
	if (!user && !user?.verified) {
		throw redirect(302, handleLoginRedirect(event));
	}

	return { user };
};
