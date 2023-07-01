<script lang="ts">
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import ProductCard from '$lib/components/client/ProductCard.svelte';
	import { onMount } from 'svelte';

	let loading = false;
	let favourites: any[] = [];

	async function get() {
		loading = true;
		await fetch(`/api/favourites`)
			.then((res) => res.json())
			.then((res) => {
				favourites = res.favourites;
				loading = false;
			});
	}

	onMount(async () => {
		await get();
	});
</script>

<svelte:head>
	<title>My favourites products - {PUBLIC_APP_NAME}</title>
</svelte:head>

<main class="px-4 max-w-screen-xl mx-auto space-y-3">
	<h4>My favourites products</h4>
	<div>
		<div class="grid gap-8 grid-cols-4 h-full">
			{#each favourites as item}
				<ProductCard product={item.product} categorySlug={item.product.category.slug} />
			{/each}

			{#if loading}
				<div class="w-full h-64 bg-stone-100 animate-pulse rounded-lg" />
			{/if}
		</div>
	</div>
</main>
