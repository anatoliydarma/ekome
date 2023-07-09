<script lang="ts">
	import dayjs from 'dayjs';
	import { getOrderStatus } from '$lib/utils';
	import Drawer from '$lib/components/Drawer.svelte';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	export let data;

	let openDrawer: boolean = false;
	let order: object | null;
	function orderDetails(row: object) {
		openDrawer = true;
		order = row;
	}
</script>

<svelte:head>
	<title>My orders - {PUBLIC_APP_NAME}</title>
</svelte:head>

<main class="px-4 max-w-screen-xl mx-auto space-y-3">
	<h4>My orders</h4>
	<div class="table-container">
		<table class="table table-hover">
			<thead>
				<tr>
					<th>Date</th>
					<th>Number</th>
					<th>Cost</th>
					<th>Qty</th>
					<th>Status</th>
					<th /></tr
				>
			</thead>
			<tbody>
				{#each data.user.orders as row, i}
					<tr>
						<td>{dayjs(row.created_at).format('DD/MM/YYYY')}</td>
						<td>{row.number}</td>
						<td>{Number(row.amount) + Number(row.shipping_cost)} €</td>
						<td>{row.items.length}</td>
						<td>{getOrderStatus(row.status)?.name}</td>
						<td
							><button
								on:click={() => {
									orderDetails(row);
								}}
							>
								Details
							</button></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<Drawer open={openDrawer} on:close={() => (openDrawer = false)}>
		<div slot="content" class="p-8 space-y-6">
			{#if order}
				<div class="table-container">
					<table class="table table-hover">
						<thead>
							<tr>
								<th>Product</th>
								<th>Quantity</th>
								<th>Pricing</th>
								<th>Total</th>
							</tr>
						</thead>
						<tbody>
							{#each order?.items as item, i}
								<tr>
									<td>
										{item.product.name}
									</td>
									<td>{item.qty}</td>
									<td>{item.price} €</td>
									<td>{Number(item.qty) * Number(item.price)} €</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<div class="">
					<div class="font-medium mb-4">Billing Details</div>
					<div class="mb-1 text-sm">{order?.client_name} | {order?.client_email}</div>
					<address class="text-primary-500 italic text-sm">
						{order?.address.street}, {order?.address.city}, {order?.address.country}, {order
							?.address.zip}<br />{order?.address.etc}<br />

						{#if order?.client_phone}
							<abbr title="Phone">Phone: {order?.client_phone}</abbr>
						{/if}
					</address>
				</div>

				<div class="">
					<div class="mb-1 text-sm">
						<b>Order Status:</b>
						{getOrderStatus(order.status)?.name}
					</div>
					{#if order?.tracker_number}
						<b>Tracking number:</b> {order?.tracker_number}
					{/if}
				</div>
			{/if}
		</div>
	</Drawer>
</main>
