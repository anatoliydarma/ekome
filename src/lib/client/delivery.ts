import { DELIVERY, EURO, STRIPE, VAT } from '$lib/consts';

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
