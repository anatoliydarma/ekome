import type { RequestEvent } from '@sveltejs/kit';
import { ORDER_STATUSES } from '$lib/consts';
import { readable } from 'svelte/store';
import { navigating } from '$app/stores';
import { BOX_WEIGHT } from '$lib/consts';

export function handleLoginRedirect(event: RequestEvent) {
	const redirectTo = event.url.pathname + event.url.search;
	return `/login?redirectTo=${redirectTo}`;
}

export const previousPage = readable(null, (set) => {
	const unsubscribe = navigating.subscribe(($navigating) => {
		// Check if `$navigating` has a value
		// because it's set to `null` after navigation is done
		if ($navigating) {
			set($navigating.from?.url.pathname);
		}
	});

	return () => unsubscribe();
});

export async function createOrder(order: Order) {
	return await fetch(`/api/orders/`, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ order: order })
	})
		.then((res) => res.json())
		.then((data) => {
			return data.orderId;
		});
}

export async function saveCart(cart: Cart) {
	await fetch('/api/cart', {
		body: JSON.stringify({ cart: cart }),
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((res) => res.json())
		.then((data) => {
			if (data !== 202) {
				console.error(data);
			}
		});
}

export function clickOutside(node) {
	const handleClick = (event) => {
		if (node && !node.contains(event.target) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('click-outside', node));
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}

export function getOrderStatus(status: string) {
	return ORDER_STATUSES.find((s) => s.value === status);
}

const removeQueryValue = (params: URLSearchParams, key: string, valueToRemove: any) => {
	const values = params.getAll(key);
	if (values.length) {
		params.delete(key);
		for (const value of values) {
			if (value !== String(valueToRemove)) {
				params.append(key, value);
			}
		}
	}
};

export function createSearchParams(params: string | { [s: string]: unknown } | ArrayLike<unknown>) {
	return new URLSearchParams(
		Object.entries(params).flatMap(([key, values]) =>
			Array.isArray(values) ? values.map((value) => [key, value]) : [[key, values]]
		)
	);
}

export const changeQuery = async (params: URLSearchParams, type: string, item: any) => {
	let has = false;
	params.forEach((value, key) => {
		if (key == type && value == item) {
			has = true;
		}
	});

	if (has) {
		removeQueryValue(params, type, item);
	} else {
		if (params.has(type)) {
			params.append(type, item);
		} else {
			params.set(type, item);
		}
	}
	createSearchParams(params.toString());
};

export function getFlagEmoji(countryCode: string) {
	const codePoints = countryCode
		.toUpperCase()
		.split('')
		.map((char) => 127397 + char.charCodeAt(0));

	return String.fromCodePoint(...codePoints);
}

export const pluralize = (val: number, word: string, plural = word + 's') => {
	if (val >= 1000 && word == 'gram') {
		return 'kg';
	}
	const _pluralize = (num: number, word: string, plural = word + 's') =>
		[1, -1].includes(Number(num)) ? word : plural;
	if (typeof val === 'object')
		return (num: number, word: string) => _pluralize(num, word, val[word]);
	return _pluralize(val, word, plural);
};

export const niceGrams = (grams: number) => {
	return grams >= 1000 ? grams / 1000 : grams;
};

export const getCost = (item: CartItem) => {
	return (item.price * item.qty).toFixed(1);
};

export const getOrderSubtotal = (items: CartItem[]) => {
	return Number(
		items?.reduce((total: number, item: CartItem) => total + item.price * item.qty, 0).toFixed(1)
	);
};

export const getOrderTotal = (order: Order) => {
	return (Number(order.amount) + Number(order.shipping_cost) + Number(order.tax_cost)).toFixed(1);
};

export const getOrderWeight = (items: CartItem[]) => {
	return (
		items?.reduce(
			(total: number, item: CartItem) => Number(niceGrams(item.weight)) * item.qty + Number(total),
			0
		) + BOX_WEIGHT
	);
};
