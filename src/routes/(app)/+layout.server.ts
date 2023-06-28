import { cartStore } from '$lib/stores/shop';
import { get } from 'svelte/store';

let cart: any;

export const load = async ({ fetch, locals, url }) => {
	const { user } = await locals.auth.validateUser();

	cart = get(cartStore);

	if (!cart.length) {
		const res = await fetch('/api/cart');
		cart = await res.json();
	}

	return { cart: cart, user: user, url: url.pathname };
};
