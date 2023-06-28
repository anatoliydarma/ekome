<script lang="ts">
	import { page } from '$app/stores';
	import ProductCard from '$lib/components/client/ProductCard.svelte';
	import ProductsFilters from '$lib/components/client/ProductsFilters.svelte';
	import type { PageData } from './$types';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import { onMount } from 'svelte';
	import IconLoader2 from '~icons/tabler/loader-2';

	export let data: PageData;
	const category = data.category;
	let p = 0;
	let count = 0;
	let loading = false;
	let end = false;
	let products: any[] = [];
	let newProducts: any[] = [];
	let sortBy = $page.url.searchParams.get('sortBy') || '-created_at';

	onMount(() => {
		loadData();
	});

	async function sortNow(s: string | null = null) {
		if (s == 'null' || s == null || s == undefined || s == 'undefined') {
			$page.url.searchParams.delete('sortBy');
		} else {
			$page.url.searchParams.set('sortBy', s);
		}

		p = 0;
		end = false;
		products = [];
		newProducts = [];
		await loadData();
	}

	async function filter() {
		p = 0;
		end = false;
		products = [];
		newProducts = [];
		await loadData();
	}

	async function loadData() {
		if (loading) return;

		if (!end) {
			loading = true;
			await fetch(`/api/products?slug=${category.slug}&p=${p}&${$page.url.searchParams.toString()}`)
				.then((res) => res.json())
				.then((res) => {
					newProducts = res.products;
					p = res.p;
					count = res.count ? res.count : count;
					end = res.end;

					setTimeout(() => {
						loading = false;
					}, 600);
				});
		}
	}

	function scrollToTop() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	$: products = [...products, ...newProducts];
</script>

<svelte:head>
	<title>{category?.name} - {PUBLIC_APP_NAME}</title>
</svelte:head>

<main class="px-4 max-w-screen-xl mx-auto space-y-6 min-h-screen h-full">
	<ol class="breadcrumb text-xs">
		<li class="crumb">
			<a class="text-stone-500 unstyled hover:underline" href="/">Home</a>
		</li>
		<li class="crumb-separator" aria-hidden>&rsaquo;</li>
		<li>{category?.name}</li>
	</ol>

	<div class="grid gap-6 grid-cols-12 h-full">
		<div class="col-span-2 pt-12">
			<ProductsFilters on:get-data={() => filter()} filters={data.filters} {loading} />
		</div>
		<div class="col-span-10 space-y-6 h-full">
			<div class="justify-between items-center gap-6 flex">
				<div class="text-sm">
					{#if count > 0}
						{count} products
					{/if}
				</div>

				<div>
					<select class="select" id="sort" bind:value={sortBy} on:change={() => sortNow(sortBy)}>
						{#each data.sorts as s}
							<option value={s.val}>{s.name}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="grid gap-8 grid-cols-4 h-full">
				{#each products as product}
					<ProductCard {product} categorySlug={category.slug} />
				{/each}

				{#if loading}
					<div class="w-full h-64 bg-stone-100 animate-pulse rounded-lg" />
				{/if}

				{#if end && !loading}
					<div class="w-full h-64 bg-stone-100 rounded-lg flex justify-center items-center">
						<button on:click={() => scrollToTop()} class="btn variant-filled">Go to top</button>
					</div>
				{/if}
			</div>

			{#if products.length !== count && !end && !loading}
				<div class=" flex justify-center items-center">
					<button on:click={() => loadData()} class="btn variant-filled flex items-center gap-1">
						{#if loading}
							<IconLoader2 class="text-lime-500 animate-spin" />
						{/if}

						Show more
					</button>
				</div>
			{/if}
		</div>
	</div>

	<div class="py-12">
		<p>{category?.desc || ''}</p>
	</div>
</main>
