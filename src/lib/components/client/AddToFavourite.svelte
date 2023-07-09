<script lang="ts">
	import IconLoader2 from '~icons/tabler/loader-2';
	import IconHeart from '~icons/tabler/heart';
	import IconHeartFilled from '~icons/tabler/heart-filled';
	import { onMount } from 'svelte';

	export let product_id: number | null = null;

	$: isFavourite = false;
	$: loading = false;

	async function check() {
		loading = true;
		await fetch(`/api/favourites/${product_id}`)
			.then((res) => res.json())
			.then((res) => {
				isFavourite = res.isFavourite;
				loading = false;
			});
	}

	async function toggle() {
		if (loading) return;

		loading = true;
		await fetch(`/api/favourites/${product_id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ isFavourite })
		})
			.then((res) => res.json())
			.then((res) => {
				isFavourite = res.isFavourite;
				loading = false;
			});
	}

	onMount(async () => {
		await check();
	});
</script>

<button
	on:click={() => toggle()}
	class="group variant-ringed-primary btn flex gap-2"
	title="Favourite"
>
	{#if loading}
		<IconLoader2 class="text-primary-500 animate-spin w-6 h-6" />
	{:else if isFavourite}
		<IconHeartFilled class="w-6 h-6 text-primary-500 group-hover:text-primary-600" />
	{:else}
		<IconHeart class="w-6 h-6 group-hover:text-primary-500" />
	{/if}
	Favourite
</button>
