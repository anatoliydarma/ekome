<script lang="ts">
	import IconEdit from '~icons/tabler/edit';
	import Pagination from '$lib/components/Pagination.svelte';

	export let data;
	let url = '/admin/properties/';
</script>

<svelte:head>
	<title>Properties</title>
</svelte:head>

<main class="p-8 max-w-screen-xl space-y-6">
	<div class="flex justify-between items-center">
		<h3>Properties</h3>
		<a href="/admin/properties/{null}" class="btn variant-filled">Add new</a>
	</div>

	<div class="table-container">
		<table class="table table-hover">
			<thead>
				<tr>
					<th>Name</th>
					<th />
				</tr>
			</thead>

			<tbody>
				{#each data.properties[0] as property}
					<tr>
						<td>{property.name}</td>
						<td>
							<a href="/admin/properties/{property.id}" class="hover w-6"><IconEdit /></a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<Pagination pagination={data.properties[1]} {url} />
	</div>
</main>
