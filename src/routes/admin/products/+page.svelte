<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import IconEdit from '~icons/tabler/edit';
	import Pagination from '$lib/components/Pagination.svelte';
	import Drawer from '$lib/components/Drawer.svelte';
	import ImportCsv from '$lib/components/admin/ImportCsv.svelte';
	import { page } from '$app/stores';

	export let data;
	let url = '/admin/products/';
	$: open = false;
	async function closeDrawer() {
		open = false;
		await goto($page.url.toString());
		await invalidateAll();
	}
</script>

<svelte:head>
	<title>Products</title>
</svelte:head>

<main class="p-8 max-w-screen-xl space-y-6">
	<div class="flex justify-between items-center gap-6">
		<h3>Products</h3>
		<div class="flex justify-end items-center gap-6">
			<a href="/admin/products/add" class="btn variant-filled-primary">Add new</a>

			<button on:click={() => (open = true)} class="btn variant-filled">Import</button>
			<Drawer {open} on:close={() => closeDrawer()}>
				<div slot="content">
					<ImportCsv on:close={() => closeDrawer()} />
				</div>
			</Drawer>
		</div>
	</div>

	<div class="table-container">
		<table class="table table-hover">
			<thead>
				<tr>
					<th>Name</th>
					<th>sku</th>
					<th>Price</th>
					<th>Status</th>
					<th>Category</th>
					<th />
				</tr>
			</thead>

			<tbody>
				{#each data.products[0] as product}
					<tr>
						<td>{product.name}</td>
						<td>{product.sku}</td>
						<td>{product.price}</td>
						<td>{product.status}</td>
						<td>{product.category.name}</td>
						<td>
							<a href="/admin/products/{product.id}" class="hover w-6 h-6">
								<IconEdit class="w-6 h-6" />
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<Pagination pagination={data.products[1]} {url} />
	</div>
</main>
