import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_DOMAIN } from '$env/static/public';
import { pb } from '$lib/server/pocketbase';

export const handleMiddleware = async ({ resolve, event }) => {
	pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
	if (pb.authStore.isValid) {
		try {
			await pb.collection('users').authRefresh();
		} catch (_) {
			pb.authStore.clear();
		}
	}

	event.locals.pb = pb;
	event.locals.user = structuredClone(pb.authStore.model);

	const response = await resolve(event);
	response.headers.set('set-cookie', pb.authStore.exportToCookie({ httpOnly: false }));

	if (event.url.pathname.startsWith('/account') && !event.locals.user) {
		throw redirect(303, '/login');
	}

	if (event.url.pathname.startsWith('/admin') && event.locals.user?.role !== 'admin') {
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

	if (event.url.pathname.startsWith('/api')) {
		response.headers.append('Access-Control-Allow-Origin', PUBLIC_DOMAIN);
	}

	return response;
};

export const handle = sequence(handleMiddleware);

export const handleError = ({ error, event }) => {
	console.error(error);
	return {
		message: "An unexpected error occurred. We're working on it."
	};
};
