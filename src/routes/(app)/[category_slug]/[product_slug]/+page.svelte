<script lang="ts">
	import type { PageData } from './$types';
	import SelectQty from '$lib/components/SelectQty.svelte';
	import AddToCart from '$lib/components/client/AddToCart.svelte';
	import RelatedProducts from '$lib/components/client/RelatedProducts.svelte';
	import { pluralize, niceGrams } from '$lib/utils';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import AddToFavourite from '$lib/components/client/AddToFavourite.svelte';
	export let data: PageData;
	$: product = data.product;
	$: mainImage = product.images ? product.images[0] : null;

	$: qty = product.min_qty;
	function setQty(event: { detail: number }) {
		qty = event.detail;
	}
</script>

<svelte:head>
	<title>{product.name} - {PUBLIC_APP_NAME}</title>
</svelte:head>

<main class="px-4 max-w-screen-xl mx-auto">
	<ol class="breadcrumb text-xs">
		<li class="crumb">
			<a class="text-stone-500 unstyled hover:underline" href="/"> Home </a>
		</li>
		<li class="crumb-separator" aria-hidden>&rsaquo;</li>
		<li>
			<a class="text-stone-500 unstyled hover:underline" href="/{product.category.slug}">
				{product.category?.name}
			</a>
		</li>
		<li class="crumb-separator" aria-hidden>&rsaquo;</li>
		<li>{product.name}</li>
	</ol>

	<div class="flex flex-col md:flex-row gap-12 pt-8">
		<div class=" w-full md:w-7/12">
			<div class="w-full">
				<img
					src={mainImage ? `/assets/${mainImage}` : '/img/noimage.svg'}
					alt={product.name}
					class="h-auto w-full bg-stone-50"
				/>
			</div>

			{#if product.images && product.images.length > 0}
				<div class="flex gap-4 pt-4">
					{#each product.images as image}
						<button on:click={() => (mainImage = image)} class="overflow-hidden">
							<img
								src={image ? `/assets/${image}` : ''}
								alt={product.name}
								class="focus:outline-none object-cover w-12 rounded-md h-12 bg-stone-100 border-2 border-transparent hover:border-lime-500"
							/>
						</button>
					{/each}
				</div>
			{/if}

			<div class="pt-8">
				{#if product.desc}
					<div class="prose prose-stone">
						{@html product.desc}
					</div>
				{/if}
			</div>
		</div>

		<div class="w-full md:w-5/12 text-stone-600">
			<div class="sticky top-20 z-10">
				<h2 class="mb-2 leading-tight tracking-tight font-bold text-stone-800 text-2xl md:text-3xl">
					{product.name}
				</h2>
				{#if product.sku}
					<div>
						sku: {product.sku}
					</div>
				{/if}

				<div class="flex items-center space-x-4 py-4">
					<div>
						<div class="rounded-lg bg-stone-100 flex py-2 px-3">
							<span class="text-stone-800 pr-1 pt-1">€</span>
							<span class="font-bold text-stone-800 text-3xl">{product.price}</span>
						</div>
					</div>
					<div class="text-stone-500 text-sm">
						<p>
							Price / {niceGrams(product.weight)}
							{pluralize(product.weight, product.unit)}
						</p>
						<p>excl. VAT</p>
					</div>
				</div>

				<div class="space-y-2">
					<div class="w-40">
						{#if product.weight}
							<div class="text-sm pb-1 text-stone-500 flex justify-between">
								Weight: <span
									>{niceGrams(product.weight)}
									{pluralize(product.weight, product.unit)}</span
								>
							</div>
						{/if}
						<div class="text-sm pb-1 text-stone-500 flex justify-between">
							Min order: <span>
								{niceGrams(product.min_qty)}
								{pluralize(product.min_qty, product.unit)}
							</span>
						</div>
					</div>
					<SelectQty minQty={product.min_qty} on:set-qty={setQty} />
				</div>
				<div class="flex py-8 gap-6 items-center">
					<AddToCart {product} {qty} />
					<AddToFavourite product_id={product.id} />
				</div>
			</div>
		</div>
	</div>

	<RelatedProducts streamed={data.streamed} categorySlug={product.category.slug} />
</main>
