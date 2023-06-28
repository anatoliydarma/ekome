import Stripe from 'stripe';
import { SECRET_STRIPE_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

// initialize Stripe
const stripe = new Stripe(SECRET_STRIPE_KEY, {
	apiVersion: '2022-11-15'
});

// handle POST /create-payment-intent
export const POST = async ({ request }) => {
	const { amount } = await request.json();
	// create the payment intent
	const paymentIntent = await stripe.paymentIntents.create({
		amount: amount * 100,
		// note, for some EU-only payment methods it must be EUR
		currency: 'eur',
		// specify what payment methods are allowed
		// can be card, sepa_debit, ideal, etc...
		payment_method_types: ['card']
	});

	return json({ clientSecret: paymentIntent.client_secret });
};
