<script lang="ts">
	import { cartStore } from '$lib/stores/shop';
	import IconLoader2 from '~icons/tabler/loader-2';

	export let product: any;
	export let qty: number;
	let loading = false;

	// TODO test it
	async function addToCart() {
		if (
			$cartStore &&
			$cartStore.items.length > 0 &&
			$cartStore.items.find((item: { product_id: number }) => item.product_id === product.id)
		) {
			$cartStore.items.map((item: { product_id: any; qty: number }) => {
				if (item.product_id === product.id) {
					item.qty += qty;
				}
				$cartStore = $cartStore;
			});
		} else {
			$cartStore.items.push({
				product_id: product.id,
				name: product.name,
				price: product.price,
				image: product.images ? product.images[0] : null,
				qty: qty,
				min_qty: product.min_qty,
				weight: product.weight || 100
			});
		}

		$cartStore = $cartStore;

		loading = true;
		let payload = { cart: $cartStore };
		await fetch('/api/cart', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		})
			.then((res) => res.json())
			.then((data) => {
				setTimeout(() => {
					loading = false;
				}, 300);

				if (data !== 202) {
					console.error(data);
				}
			});
	}
</script>

<button
	on:click={addToCart}
	disabled={loading}
	type="button"
	class="btn bg-secondary-600 text-white flex gap-2"
>
	Add to Cart
	{#if loading}
		<IconLoader2 class="text-primary-100 animate-spin" />
	{/if}
</button>
