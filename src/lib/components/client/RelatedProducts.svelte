<script lang="ts">
	import ProductCard from './ProductCard.svelte';

	export let streamed: { relatedProducts: any[] };
	export let categorySlug: string;
	$: streamed = streamed;
</script>

<div class="pt-24">
	{#await streamed}
		<div class="grid gap-8 grid-cols-4">
			<div class="w-full h-60 bg-stone-100 animate-pulse rounded-lg" />
			<div class="w-full h-60 bg-stone-100 animate-pulse rounded-lg" />
			<div class="w-full h-60 bg-stone-100 animate-pulse rounded-lg" />
			<div class="w-full h-60 bg-stone-100 animate-pulse rounded-lg" />
		</div>
	{:then value}
		{#if value.relatedProducts.length}
			<div class="text-xl font-medium py-2">Related products</div>
			<div class="grid gap-8 grid-cols-4">
				{#each value.relatedProducts as product}
					<ProductCard {product} {categorySlug} />
				{/each}
			</div>
		{/if}
	{/await}
</div>
