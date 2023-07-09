<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { previousPage } from '$lib/client/utils';
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

	$: if ($previousPage === '/search' && $page.url.pathname !== '/search') {
		search = '';
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:keydown={handleKeydown} class="flex w-full">
	<input
		bind:value={search}
		type="text"
		class="flex-shrink flex-grow max-w-full leading-5 py-2 px-4 text-primary-800 bg-primary-50/50 overflow-x-auto focus:outline-none border-0 focus:ring-0 dark:text-primary-600 dark:bg-primary-700 placeholder:text-primary-300"
		placeholder="Search…"
		aria-label="Search"
	/>
	<div class="-mr-px">
		<button
			on:click={() => searchIt()}
			class="flex items-center py-2.5 px-4 leading-5 text-primary-400 bg-primary-50/50 border-0 hover:bg-primary-200 hover:ring-0 focus:bg-primary-600 focus:outline-none focus:ring-0"
			type="submit"
		>
			<IconSearch />
		</button>
	</div>
</div>
