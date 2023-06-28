<script lang="ts">
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import { changeQuery } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let filters: any[] = [];
	export let loading = false;

	let filtersFromQuery = {
		pr: [],
		unit: []
	};

	async function clearFilters() {
		filtersFromQuery = {
			pr: [],
			unit: []
		};
		if ($page.url.pathname == '/search') {
			let search = $page.url.searchParams.get('search') || 'soap';
			$page.url.searchParams.set('search', search);

			let url = `/search?${$page.url.searchParams.toString()}`;
			await goto(url, { invalidateAll: true });
		} else {
			await goto($page.url.pathname);
			await invalidateAll();
			dispatch('get-data');
		}
	}

	async function goCheckbox(key: string, item: any) {
		await changeQuery($page.url.searchParams, key, item);
		history.pushState(null, '', $page.url.toString());
		dispatch('get-data');
	}

	function getQuery() {
		$page.url.searchParams.forEach(function (value: any, key: string) {
			if (key == 'pr') {
				filtersFromQuery.pr.push(Number(value));
			}
			if (key == 'unit') {
				filtersFromQuery.unit.push(String(value));
			}
		});
	}
	getQuery();
</script>

<div class="divide-y divide-stone-200 space-y-6">
	{#each filters as filter}
		{#if filter.items?.length}
			<div class="text-sm pt-5">
				<div class="capitalize pb-3">{filter.name}</div>
				<div class="space-y-2 text-stone-500">
					{#each filter.items as item}
						{#if filter.name === 'properties'}
							<label class="flex items-center space-x-2 cursor-pointer">
								<input
									class="checkbox"
									type="checkbox"
									value={item.id}
									disabled={loading}
									bind:group={filtersFromQuery.pr}
									on:change={() => goCheckbox('pr', item.id)}
								/>
								<p>{item.name}</p>
							</label>
						{/if}
						{#if filter.name === 'units'}
							<label class="flex items-center space-x-2 cursor-pointer">
								<input
									class="checkbox"
									type="checkbox"
									value={item.value}
									disabled={loading}
									bind:group={filtersFromQuery.unit}
									on:change={() => goCheckbox('unit', item.value)}
								/>
								<p>{item.name}</p>
							</label>
						{/if}
					{/each}
				</div>
			</div>
		{/if}
	{/each}

	{#if filtersFromQuery.pr.length || filtersFromQuery.unit.length}
		<div class="pt-6">
			<button class="btn variant-ringed-surface text-xs" on:click={() => clearFilters()}>
				Clear all
			</button>
		</div>
	{/if}
</div>
