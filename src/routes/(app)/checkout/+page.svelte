<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import CartItems from '$lib/components/client/CartItems.svelte';
	import PhoneInput from '$lib/components/form/PhoneInput.svelte';
	import { cartStore } from '$lib/stores/shop';
	import UserAddresses from '$lib/components/client/UserAddresses.svelte';
	import { order } from '$lib/stores/shop';
	import { onMount } from 'svelte';
	import Payment from '$lib/components/client/Payment.svelte';
	import { getCostOfDeliveryAndVat, niceGrams } from '$lib/utils';
	import { BOX_WEIGHT } from '$lib/consts';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	export let data;

	let showPayment = false;
	let vatProcent: number | null = null;

	$: $order.amount = Number(
		$cartStore.items
			?.reduce((total: number, item: CartItem) => total + (item.price * item.qty) / item.weight, 0)
			.toFixed(1)
	);
	$: $order.shipping_cost = 0;
	$: $order.tax_cost = 0;

	// TODO calc properly
	$: $order.weight =
		$cartStore.items?.reduce(
			(total: number, item: CartItem) => Number(niceGrams(item.weight)) * item.qty + Number(total),
			0
		) + BOX_WEIGHT;

	$: $cartStore = $cartStore;

	$: if ($order.client_country) {
		let calcCost = getCostOfDeliveryAndVat($order);
		$order.shipping_cost = calcCost.shipping;
		$order.tax_cost = calcCost.vat;
		vatProcent = calcCost.vatProcent;
	}

	onMount(async () => {
		if (!$order.client_email) {
			await fetch(`/api/users/${data.user.id}`, {
				method: 'get',
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then((res) => res.json())
				.then((data) => {
					$order.client_name = data.name;
					$order.client_email = data.email;
					$order.client_phone = data.phone;
				});
		}
	});
</script>

<svelte:head>
	<title>Checkout - {PUBLIC_APP_NAME}</title>
</svelte:head>

<div>
	<div class="w-full relative h-16 z-30">
		<div class="p-4 max-w-screen-xl mx-auto">
			<div class="flex gap-6 items-center justify-between">
				<a href="/" class="flex items-center">
					<Logo class="h-6  sm:h-9" />
				</a>
			</div>
		</div>
	</div>

	<div class="bg-white">
		<div class="fixed top-0 left-0 hidden h-full w-1/2 bg-white lg:block z-10" aria-hidden="true" />
		<div
			class="fixed top-0 right-0 hidden h-full w-1/2 bg-primary-50/50 lg:block z-10"
			aria-hidden="true"
		/>

		<div
			class="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-2 lg:px-4 xl:gap-48 z-20 py-12"
		>
			<div class="space-y-6">
				{#if !showPayment}
					<div>
						<div class="flex gap-6 justify-between items-center w-full">
							<h3 class="text-xl font-semibold text-primary-900 pb-3">Contact information</h3>
						</div>
						<div class="space-y-4 max-w-xs">
							<label class="label">
								<span class="text-sm">Full name <span class="text-red-600">*</span></span>
								<input
									class="input"
									bind:value={$order.client_name}
									type="text"
									id="Name"
									placeholder="Name"
									required
								/>
							</label>

							<label class="label">
								<span class="text-sm">Email <span class="text-red-600">*</span></span>
								<input
									class="input"
									bind:value={$order.client_email}
									type="email"
									id="Email"
									placeholder="Email"
									required
								/>
							</label>

							<div>
								<label for="phone" class="label pb-1 text-sm">
									Phone number <span class="text-red-600">*</span>
								</label>
								<PhoneInput bind:value={$order.client_phone} disabled />
							</div>
						</div>
					</div>

					<div class="border-t border-primary-200">
						<div class="pt-6">
							<h3 class="text-xl font-semibold text-primary-900">Shipping information</h3>
							<UserAddresses formData={data} />
						</div>
					</div>

					<div>
						<button
							on:click={() => (showPayment = true)}
							disabled={$order.shipping_cost == 0 && !$order.client_phone}
							class="w-full btn variant-filled-secondary"
						>
							Checkout
						</button>
					</div>
				{:else}
					<Payment on:back={() => (showPayment = false)} />
				{/if}
			</div>
			<div>
				<h3 class="text-xl font-semibold text-primary-900 pb-4">Order summary</h3>

				<CartItems cart={data.cart} showQty={!showPayment} showRemove={false} />

				<div class="pt-6">
					<div class="space-y-4">
						<div class="flex items-center justify-between border-t border-primary-200 pt-6">
							<div class="text-sm">Weight (Net)</div>
							<div class="text-sm font-medium text-primary-900">
								{niceGrams($order.weight)} kg
							</div>
						</div>

						<div class="flex items-center justify-between">
							<div class="text-sm">Subtotal</div>
							<div class="text-sm font-medium text-primary-900">€ {$order.amount}</div>
						</div>
						<div class="flex items-center justify-between">
							<div class="text-sm">Shipping</div>
							<div class="text-sm font-medium text-primary-900">
								{#if $order.client_country}
									€ {$order.shipping_cost}
								{:else}
									<span class="text-primary-400">Select shipping address</span>
								{/if}
							</div>
						</div>
						<div class="flex items-center justify-between">
							<div class="text-sm">VAT ({vatProcent || ''}%)</div>
							<div class="text-sm font-medium text-primary-900">
								{#if $order.client_country}
									€ {$order.tax_cost}
								{:else}
									<span class="text-primary-400">Select shipping address</span>
								{/if}
							</div>
						</div>

						<div class="flex items-center justify-between border-t border-primary-200 pt-6">
							<div class="text-base font-medium">Total</div>
							<div class="text-base font-medium text-primary-900">
								€ {(
									Number($order.amount) +
									Number($order.shipping_cost) +
									Number($order.tax_cost)
								).toFixed(1)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
