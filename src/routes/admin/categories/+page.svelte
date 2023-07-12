<script lang="ts">
	import IconEdit from '~icons/tabler/edit';
	import Pagination from '$lib/components/Pagination.svelte';

	export let data;
	let url = '/admin/categories/';
</script>

<svelte:head>
	<title>Categories</title>
</svelte:head>

<main class="p-8 max-w-screen-xl space-y-6">
	<div class="flex justify-between items-center">
		<h3>Categories</h3>
		<a href={`/admin/categories/${null}`} class="btn variant-filled">Add new</a>
	</div>

	<div class="table-container">
		<table class="table table-hover">
			<thead>
				<tr>
					<th>Name</th>
					<th>Sort</th>
					<th>Status</th>
					<th />
				</tr>
			</thead>

			<tbody>
				{#each data.categories?.items as category}
					<tr>
						<td>{category.name}</td>
						<td>{category.sort}</td>
						<td>
							{#if category.status}
								<span class="badge-icon variant-filled-primary" />
							{:else}
								<span class="badge-icon variant-filled" />
							{/if}
						</td>
						<td>
							<a href="/admin/categories/{category.id}" class="hover w-6">
								<IconEdit class="w-6 h-6" />
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<Pagination pagination={data.categories} {url} />
	</div>
</main>
