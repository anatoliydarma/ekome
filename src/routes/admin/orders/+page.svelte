<script lang="ts">
	import dayjs from 'dayjs';
	import IconEdit from '~icons/tabler/edit';
	import Pagination from '$lib/components/Pagination.svelte';

	export let data;
	let url = '/admin/orders/';
</script>

<svelte:head>
	<title>Orders</title>
</svelte:head>

<main class="p-8 max-w-screen-xl space-y-6">
	<div class="flex justify-between items-center">
		<h3>Orders</h3>
		<a href="/admin/orders/new" class="btn variant-filled-primary">Add new</a>
	</div>

	<div class="table-container">
		<table class="table table-hover">
			<thead>
				<tr>
					<th>Date</th>
					<th>Status</th>
					<th>Amount</th>
					<th>Shipping</th>
					<th>Client</th>
					<th />
				</tr>
			</thead>

			<tbody>
				{#each data.orders[0] as order}
					<tr>
						<td>{dayjs(order.created_at).format('DD/MM/YYYY')}</td>
						<td>{order.status}</td>
						<td>{order.amount}</td>
						<td>{order.shipping_cost}</td>
						<td>{order.client_name}</td>

						<td>
							<a href="/admin/orders/{order.id}" class="hover w-6 h-6">
								<IconEdit class="w-6 h-6" />
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<Pagination pagination={data.orders[1]} {url} />
	</div>
</main>
