<script lang="ts">
	import { fade } from 'svelte/transition';
	import CartItems from '$lib/components/client/CartItems.svelte';
	import { cartStore } from '$lib/stores/shop';
	import IconX from '~icons/tabler/x';
	import Loading from '$lib/components/Loading.svelte';
	import type { CartItem, Cart } from './$types';
	import { browser } from '$app/environment';
	import { niceGrams } from '$lib/client/utils';
	export let cart: Cart;
	export let user: any;

	$: $cartStore = cart;

	let loading = false;
	let open = false;
	function toggle() {
		open = !open;
		if (browser) {
			document.body.classList.toggle('overflow-y-hidden');
		}
	}

	$: totalAmount = $cartStore.items.reduce(
		(total: number, item: CartItem) => total + (item.price * item.qty) / item.weight,
		0
	);

	$: totalQty = $cartStore.items.reduce((total: number, item: CartItem) => total + item.qty, 0);
</script>

<div class="relative">
	<button
		on:click={() => toggle()}
		class="p-1 group focus:outline-none hover relative"
		aria-label="Open cart"
	>
		<svg
			class="text-primary-600 w-7 h-7"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<path
				class="text-primary-600 stroke-current"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-miterlimit="10"
				stroke-width="1.5"
				d="M8.5 14.25c0 1.92 1.58 3.5 3.5 3.5s3.5-1.58 3.5-3.5M8.81 2 5.19 5.63m10-3.63 3.62 3.63"
			/>
			<path
				class="text-primary-600 stroke-current"
				stroke-width="1.5"
				d="M2 7.85c0-1.85.99-2 2.22-2h15.56c1.23 0 2.22.15 2.22 2 0 2.15-.99 2-2.22 2H4.22C2.99 9.85 2 10 2 7.85Z"
			/>
			<path
				class="text-primary-600 stroke-current"
				stroke-linecap="round"
				stroke-width="1.5"
				d="m3.5 10 1.41 8.64C5.23 20.58 6 22 8.86 22h6.03c3.11 0 3.57-1.36 3.93-3.24L20.5 10"
			/>
		</svg>

		{#if $cartStore?.items.length && !loading}
			<div class="absolute top-0 right-0 z-20">
				<div
					class="w-5 h-5 font-bold text-white bg-secondary-500 rounded-full text-xs flex items-center justify-center"
				>
					{$cartStore?.items.length}
				</div>
			</div>
		{/if}

		<div class="absolute inset-0">
			<Loading {loading} />
		</div>
	</button>

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	{#if open}
		<div
			transition:fade
			on:click={() => toggle()}
			class="fixed top-0 bottom-0 left-0 right-0 z-40 w-screen h-screen overflow-hidden bg-primary-900/25 cursor-pointer pointer-events-auto transition-all duration-500 backdrop-blur-sm"
		/>
	{/if}

	<div
		class="{open ? 'translate-x-0' : 'translate-x-full'}
            fixed top-0 right-0 z-50 h-screen text-primary-700 transition-all duration-700 ease-in-out transform bg-white w-full max-w-md"
	>
		<div class="flex flex-col justify-between h-screen">
			<div
				class="flex items-center justify-between w-full px-6 py-3 bg-white border-b border-primary-100 md:border-transparent md:py-5"
			>
				<span class="">Your cart</span>

				<div>
					<button
						on:click={() => toggle()}
						class="hover focus:outline-none focus:shadow-outline"
						aria-label="Close the cart"
					>
						<IconX class="text-primary-500 stroke-current w-7 h-7" />
					</button>
				</div>
			</div>

			<div class="relative z-50 h-full px-4 py-4 overflow-y-auto bg-white md:px-6 scrollbar">
				{#if $cartStore?.items.length}
					<CartItems {cart} />
				{:else}
					<div class="flex justify-center">
						<div class="pt-10 text-center text-primary-600">
							<div class="pt-10">Your cart is empty</div>
						</div>
					</div>
				{/if}
			</div>

			<div class="w-full bg-white border-t border-primary-100 h-96 md:h-auto md:border-transparent">
				{#if $cartStore?.items.length}
					<div class="px-6 py-3 space-y-2 bg-primary-50">
						<div class="flex items-center justify-between gap-6 font-bold">
							<div class="flex items-center gap-2">
								<span>Total: </span>
								€ {totalAmount.toFixed(1)}
							</div>

							<div class="flex items-center justify-end gap-2">
								<span>Qty:</span>
								{niceGrams(totalQty)}
							</div>
						</div>
						<div class="text-xs">Shipping and taxes calculated at checkout.</div>
					</div>
				{/if}
				{#if user && $cartStore?.items.length}
					<div class="px-6 py-2 md:py-6">
						<a
							on:click={() => toggle()}
							href="/checkout"
							class="w-full permalink inline-block px-4 py-3 font-bold leading-snug text-center text-white uppercase bg-secondary-400 rounded-lg hover:bg-secondary-500"
						>
							Checkout
						</a>
					</div>
				{/if}
			</div>

			{#if !user}
				<div class="px-6 py-2 md:py-6">
					<a
						on:click={() => toggle()}
						href="/login"
						class="w-full permalink inline-block px-4 py-3 font-bold leading-snug text-center text-white uppercase bg-secondary-400 rounded-lg hover:bg-secondary-500"
					>
						Login
					</a>
				</div>
			{/if}
		</div>
	</div>
</div>
