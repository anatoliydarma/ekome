import type { RequestEvent } from '@sveltejs/kit';
import { DELIVERY, EURO, ORDER_STATUSES, STRIPE, VAT } from '$lib/consts';
import { readable } from 'svelte/store';
import { navigating } from '$app/stores';

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

export function getCostOfDeliveryAndVat(order: Order) {
	let countryDelivery = DELIVERY[0];
	let countryVat = VAT[0];

	countryDelivery = DELIVERY.find(function (c) {
		return c.key == order.client_country;
	});

	countryVat = VAT.find(function (c) {
		return c.key == order.client_country;
	});

	let qtyParcels = Math.ceil(Number(order.weight) / 15000); // 5000 a parcel cover
	let cost: number = 0;
	for (let index = 0; index < qtyParcels; ) {
		index++;
		if (qtyParcels === index) {
			let lastParcel = Number(order.weight) - (qtyParcels - 1) * 20000;
			let times = Number(lastParcel) / 250;
			cost = cost + Number(times) * Number(countryDelivery.extra);
			cost = cost + Number(countryDelivery.first);
			cost = getClemensCost(cost);
		} else {
			let times = Number(20000) / 250;
			cost = cost + Number(times) * Number(countryDelivery.extra);
			cost = cost + Number(countryDelivery.first);
			cost = getClemensCost(cost);
		}
	}

	// console.log('cost', cost);
	// console.log('order.amount', order.amount);

	let shippingCost: number = cost / EURO;
	let vatCost: number =
		((Number(order.amount) + Number(shippingCost)) * Number(countryVat.value)) / 100;
	let extraVat: number = 21 * qtyParcels;
	vatCost = vatCost + extraVat;

	let stripeCost = (Number(vatCost) * Number(STRIPE.procent)) / 100; // '1.5%

	vatCost = vatCost + Number(stripeCost) + Number(STRIPE.price); // €0.25

	return {
		shipping: Number(shippingCost.toFixed()),
		vat: Number(vatCost.toFixed()),
		vatProcent: countryVat.value
	};
}

function getClemensCost(cost: number) {
	// min cost for Clemens
	if (cost < 3540) {
		return cost + 3540;
	} else {
		let procentCost = (cost * 5) / 100;

		return cost + procentCost;
	}
}
