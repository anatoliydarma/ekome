import { cartStore } from '$lib/stores/shop';
import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';

let cart: any;

export const load = async ({ fetch }) => {
	cart = get(cartStore);

	if (!cart.length) {
		const res = await fetch('/api/cart');
		cart = await res.json();
	}

	if (cart.items.length == 0) {
		throw redirect(302, '/');
	}

	return { cart };
};
