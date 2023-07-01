import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_DOMAIN } from '$env/static/public';

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

	if (event.url.pathname.startsWith('/api')) {
		// Required for CORS to work
		if (event.request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
					'Access-Control-Allow-Origin': PUBLIC_DOMAIN,
					'Access-Control-Allow-Headers': PUBLIC_DOMAIN
				}
			});
		}
	}

	const response = await resolve(event);
	if (event.url.pathname.startsWith('/api')) {
		response.headers.append('Access-Control-Allow-Origin', PUBLIC_DOMAIN);
	}

	return response;
};

export const handle = sequence(handleAuth, handleMiddleware);

export const handleError = ({ error, event }) => {
	console.error(error);
	return {
		message: "An unexpected error occurred. We're working on it."
	};
};
