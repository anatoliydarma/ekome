import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import { sequence } from '@sveltejs/kit/hooks';

export const handleAuth = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	return await resolve(event);
};

export const handleMiddleware = async ({ resolve, event }) => {
	const { user } = await event.locals.auth.validateUser();

	if (event.url.pathname.startsWith('/account') && !user) {
		throw redirect(303, '/login');
	}

	if (event.url.pathname.startsWith('/admin') && user?.role !== 'admin') {
		throw redirect(303, '/login');
	}

	return await resolve(event);
};

export const handle = sequence(handleAuth, handleMiddleware);

export const handleError = ({ error, event }) => {
	console.error(error);
	return {
		message: "An unexpected error occurred. We're working on it."
	};
};
