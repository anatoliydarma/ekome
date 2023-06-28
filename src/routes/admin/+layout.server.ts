export const load = async ({ locals, url }) => {
	const { user, session } = await locals.auth.validateUser();
	return { user, url: url.pathname };
};
