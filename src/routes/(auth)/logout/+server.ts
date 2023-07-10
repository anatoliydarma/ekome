import { redirect } from '@sveltejs/kit';

export const GET = async ({ locals }) => {
	locals.pb.authStore.clear();
	locals.user = null;
	throw redirect(303, '/');
};
