<script lang="ts">
	import { cartStore } from '$lib/stores/shop';
	import SelectQty from '$lib/components/SelectQty.svelte';
	import type { CartItem } from './$types';
	import { getCost } from '$lib/client/utils';
	export let cart: any;
	export let showQty: boolean = true;
	export let showRemove: boolean = true;

	let loading = false;

	function update() {
		$cartStore = $cartStore;
		saveToDb();
	}

	function remove(id: number) {
		for (let i = 0; i < $cartStore.items.length; i++) {
			if ($cartStore.items[i].product_id == id) {
				$cartStore.items.splice(i, 1);
				break;
			}
		}

		$cartStore = $cartStore;
		saveToDb();
	}

	async function saveToDb() {
		loading = true;
		let payload = { cart: $cartStore };

		await fetch('/api/cart', {
			body: JSON.stringify(payload),
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => res.json())
			.then((data) => {
				loading = false;
				if (data !== 202) {
					console.error(data);
				}
			});
	}

	$: $cartStore = cart;
</script>

<div class="relative">
	<div class="space-y-2">
		{#each $cartStore.items as item}
			<div class="flex items-start gap-4 w-full justify-between py-2">
				<div class="flex items-start gap-4">
					<img
						src={item.image ? `/assets/${item.image}` : '/img/noimage.svg'}
						alt={item.name}
						class="w-16 h-16 object-cover object-center rounded-md"
					/>
					<div class="space-y-1 -mt-1">
						<div class="font-semibold text-sm">
							{item.name}
						</div>

						{#if showQty}
							<SelectQty
								isInCart={true}
								qty={item.qty}
								minQty={item.min_qty}
								on:set-qty={(event) => ((item.qty = event.detail), update())}
							/>
						{/if}
					</div>
				</div>
				<div class="grid h-full gap-4">
					<div class="text-sm whitespace-nowrap">€ {getCost(item)}</div>

					{#if showRemove}
						<button
							on:click={() => remove(item.product_id)}
							aria-label="remove"
							class="text-xs text-primary-500 hover:text-red-500"
						>
							Remove
						</button>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
