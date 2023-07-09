<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import IconChevronLeft from '~icons/tabler/chevron-left';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import { PUBLIC_STRIPE_KEY } from '$env/static/public';
	import { Elements, PaymentElement } from '$lib/components/payment/';
	import Loading from '$lib/components/Loading.svelte';
	import { cartStore } from '$lib/stores/shop';
	import { createOrder, saveCart } from '$lib/utils';
	import { order } from '$lib/stores/shop';

	const dispatch = createEventDispatcher();
	let stripe: any = null;
	let clientSecret: string = '';
	let error: any = null;
	let elements: any;
	let processing = false;

	let amount: number;

	onMount(async () => {
		amount = Number($order.amount) + Number($order.shipping_cost) + Number($order.tax_cost);

		stripe = await loadStripe(PUBLIC_STRIPE_KEY);

		// create payment intent server side
		clientSecret = await createPaymentIntent();
	});

	async function createPaymentIntent() {
		const response = await fetch('/api/stripe', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({ amount: amount })
		});

		const { clientSecret } = await response.json();

		return clientSecret;
	}

	async function submit() {
		// avoid processing duplicates
		if (processing) return;

		processing = true;

		// confirm payment with stripe
		const result = await stripe.confirmPayment({
			elements,
			redirect: 'if_required'
		});

		// log results, for debugging
		//console.log(result);

		if (result.error) {
			// payment failed, notify user
			error = result.error;
			processing = false;
		} else {
			$order.status = 'processing';
			$order.items = $cartStore.items;
			const orderId = await createOrder($order);
			if (orderId) {
				$cartStore.items = [];
				saveCart($cartStore);

				goto(`/account/orders/${orderId}`);
			} else {
				console.error('Can`t create new order');
			}
		}
	}
</script>

<div class="py-6">
	<div class="flex gap-6 justify-between items-center w-full pb-4">
		<div class="flex gap-4 items-center">
			<button on:click={() => dispatch('back')} class="hover">
				<IconChevronLeft />
			</button>
			<h3 class="text-xl font-semibold text-primary-900">Payment</h3>
		</div>
		<div class="text-xl font-semibold text-primary-900">€ {amount}</div>
	</div>

	<div>
		{#if error}
			<p class="text-sm text-red-600">{error.message} Please try again.</p>
		{/if}

		{#if stripe && clientSecret}
			<Elements
				{stripe}
				{clientSecret}
				theme="stripe"
				labels="floating"
				variables={{ colorPrimary: '#0ea5e9', spacingUnit: '3px', borderRadius: '0.5rem' }}
				rules={{ '.Input': { border: 'solid 1px #0002' } }}
				bind:elements
			>
				<form on:submit|preventDefault={submit} class="flex flex-col gap-2 py-2">
					<PaymentElement />

					<button on:click={submit} disabled={processing} class="btn variant-filled">
						{#if processing}
							Processing...
						{:else}
							Pay
						{/if}
					</button>
				</form>
			</Elements>
		{:else}
			<Loading loading={true} />
		{/if}
	</div>
</div>
