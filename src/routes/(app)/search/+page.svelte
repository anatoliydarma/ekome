<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import ProductCard from '$lib/components/client/ProductCard.svelte';
	import { onMount } from 'svelte';
	import IconLoader2 from '~icons/tabler/loader-2';

	export let data;

	let search = $page.url.searchParams.get('search');
	let found = true;
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

	async function loadData() {
		if (loading) return;
		if (!end) {
			loading = true;
			await fetch(`/api/products?p=${p}&${$page.url.searchParams.toString()}`)
				.then((res) => res.json())
				.then((res) => {
					newProducts = res.products;
					p = res.p;
					found = res.found;
					count = res.count ? res.count : count;
					count = found ? count : 0;
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

	$: if (search !== $page.url.searchParams.get('search')) {
		search = $page.url.searchParams.get('search');
		p = 0;
		end = false;
		products = [];
		newProducts = [];

		loadData();
	}

	$: products = [...products, ...newProducts];
</script>

<svelte:head>
	<title>Search - {PUBLIC_APP_NAME}</title>
</svelte:head>

<main class="px-4 max-w-screen-xl mx-auto space-y-6 min-h-screen">
	<ol class="breadcrumb text-xs">
		<li class="crumb">
			<a class="text-primary-500 unstyled hover:underline" href="/">Home</a>
		</li>
		<li class="crumb-separator" aria-hidden>&rsaquo;</li>
		<li>Search</li>
	</ol>

	{#if found || count > 0}
		<div class="justify-between items-center gap-6 flex">
			<div class="text-sm">
				{#if count > 0}
					Search results for <strong>{search} ({count})</strong>
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

		<div class="grid gap-8 grid-cols-5">
			{#each products as product}
				<ProductCard {product} categorySlug={product.category.slug} />
			{/each}

			{#if loading}
				<div class="w-full h-64 bg-primary-100 animate-pulse rounded-lg" />
			{/if}

			{#if end && !loading}
				<div class="w-full h-64 bg-primary-100 rounded-lg flex justify-center items-center">
					<button on:click={() => scrollToTop()} class="btn variant-filled">Go to top</button>
				</div>
			{/if}
		</div>

		{#if products.length !== count && !end}
			<div class="flex justify-center items-center pt-6">
				<button on:click={() => loadData()} class="btn variant-filled flex items-center gap-1">
					{#if loading}
						<IconLoader2 class="text-lime-500 animate-spin" />
					{/if}
					Show more
				</button>
			</div>
		{/if}
	{/if}

	{#if !found}
		<h2 class="text-center py-8 space-y-2">
			<div class="text-sm">Search results for <strong>{search}</strong></div>
			<div>No Matches Found</div>
			<div class="text-sm">Please try another search</div>
		</h2>

		<h3>These popular products might interest you</h3>
		<div class="grid gap-8 grid-cols-5">
			{#each products as product}
				<ProductCard {product} categorySlug={product.category.slug} />
			{/each}
		</div>
	{/if}
</main>
