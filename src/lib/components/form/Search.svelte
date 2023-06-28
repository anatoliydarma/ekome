<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import IconSearch from '~icons/tabler/search';

	let search: string = $page.url.searchParams.get('search') || '';
	async function searchIt() {
		$page.url.searchParams.set('search', search);
		let url = `/search?${$page.url.searchParams.toString()}`;
		await goto(url);
		await invalidateAll();
	}

	function handleKeydown(e: any) {
		if (e.key == 'Enter') {
			searchIt();
		}
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:keydown={handleKeydown} class="flex w-full group">
	<input
		bind:value={search}
		type="text"
		class="flex-shrink flex-grow max-w-full leading-5 text-sm py-2 px-4 rounded-l-lg text-stone-800 bg-stone-100 overflow-x-auto focus:outline-none border border-stone-100 focus:border-stone-200 group-hover:border-stone-200 focus:ring-0 dark:text-stone-400 dark:bg-stone-700 dark:border-stone-700 dark:focus:border-stone-600 placeholder:text-stone-300"
		placeholder="Search…"
		aria-label="Search"
	/>
	<div class="-mr-px">
		<button
			on:click={() => searchIt()}
			class="flex group-hover:border-stone-200 items-center py-2 px-4 -ml-1 rounded-r-lg leading-5 text-stone-400 bg-stone-100 border border-stone-100 hover:bg-stone-200 hover:ring-0 hover:border-stone-200 focus:bg-stone-600 focus:border-stone-600 focus:outline-none focus:ring-0"
			type="submit"
		>
			<IconSearch />
		</button>
	</div>
</div>
