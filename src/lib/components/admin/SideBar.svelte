<script lang="ts">
	import { drawerStore, LightSwitch, autoModeWatcher } from '@skeletonlabs/skeleton';

	import IconUsers from '~icons/tabler/users';
	import IconDashboard from '~icons/tabler/dashboard';
	import IconCategory2 from '~icons/tabler/category-2';
	import IconFolders from '~icons/tabler/folders';
	import IconTags from '~icons/tabler/tags';
	import IconShoppingCart from '~icons/tabler/shopping-cart';

	import { page } from '$app/stores';

	function drawerClose(): void {
		drawerStore.close();
	}

	$: activeUrl = $page.url;
	export let links = [
		{
			name: 'Dashboard',
			url: '/admin',
			icon: IconDashboard
		},
		{
			name: 'Orders',
			url: '/admin/orders',
			icon: IconShoppingCart
		},
		{
			name: 'Products',
			url: '/admin/products',
			icon: IconCategory2
		},
		{
			name: 'Categories',
			url: '/admin/categories',
			icon: IconFolders
		},
		{
			name: 'Properties',
			url: '/admin/properties',
			icon: IconTags
		},
		{
			name: 'Users',
			url: '/admin/users',
			icon: IconUsers
		}
	];
</script>

<svelte:head>
	{@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}
</svelte:head>

<nav class="list-nav py-4 grid h-full">
	<ul>
		{#each links as link, a}
			<li class="relative">
				{#if activeUrl.pathname == link.url}
					<span
						class="absolute inset-y-0 left-0 w-1 bg-lime-600 rounded-tr-lg rounded-br-lg"
						aria-hidden="true"
					/>
				{/if}

				<a
					class="{activeUrl.pathname.startsWith(link.url)
						? ''
						: ''} inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-primary-800 dark:hover:text-primary-200 !no-underline"
					href={link.url}
					on:click={drawerClose}
				>
					{#if link.icon}
						<svelte:component this={link.icon} />
					{/if}
					<span class="ml-4">{link.name}</span>
				</a>
			</li>
		{/each}
	</ul>

	<div class="p-4 flex flex-col justify-end">
		<LightSwitch rounded={'rounded-full'} />
	</div>
</nav>
