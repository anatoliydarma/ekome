<script lang="ts">
	import { PUBLIC_APP_NAME } from '$env/static/public';

	export let data;
</script>

<svelte:head>
	<title>My order {data.order.id} - {PUBLIC_APP_NAME}</title>
</svelte:head>

<!-- svelte-ignore a11y-no-redundant-roles -->
<div>
	<div class="space-y-2">
		<div class="text-secondary-600">Payment successful</div>
		<h3 class="text-2xl">Thanks for ordering</h3>
		<p>
			We appreciate your order, we’re currently processing it. So hang tight and we’ll send you
			confirmation very soon!
		</p>
	</div>

	<ul
		role="list"
		class="mt-6 divide-y divide-stone-200 border-t border-stone-200 text-sm font-medium text-stone-500"
	>
		{#each data.order.items as item}
			<li class="flex space-x-6 py-6">
				<img
					src={item.product?.images && item.product?.images.length > 0
						? `/assets/${item.product.images[0]}`
						: '/img/noimage.svg'}
					alt={item.product.name}
					class="h-24 w-24 flex-none rounded-md bg-stone-100 object-cover object-center"
				/>
				<div class="flex-auto space-y-1">
					<h4 class="text-stone-900">{item.product.name}</h4>
					<p>Qty: {item.qty}</p>
				</div>
				<p class="flex-none font-medium text-stone-900">€ {item.price}</p>
			</li>
		{/each}
	</ul>

	<dl class="space-y-6 border-t border-stone-200 pt-6 text-sm font-medium text-stone-500">
		<div class="flex justify-between">
			<dt>Subtotal</dt>
			<dd class="text-stone-900">€ {data.order.amount}</dd>
		</div>

		<div class="flex justify-between">
			<dt>Shipping</dt>
			<dd class="text-stone-900">€ {data.order.shipping_cost}</dd>
		</div>

		<div class="flex justify-between">
			<dt>Taxes</dt>
			<dd class="text-stone-900">€ {data.order.tax_cost}</dd>
		</div>

		<div class="flex items-center justify-between border-t border-stone-200 pt-6 text-stone-900">
			<dt class="text-base">Total</dt>
			<dd class="text-base">
				€
				{Number(data.order.tax_cost) + Number(data.order.shipping_cost) + Number(data.order.amount)}
			</dd>
		</div>
	</dl>

	<dl class="pt-8 grid grid-cols-2 gap-x-4 text-sm text-stone-600">
		<div>
			<dt class="font-medium text-stone-900">Shipping Address</dt>
			<dd class="mt-2">
				<address class="not-italic">
					<div>{data.order.client_name}</div>
					<div>
						{data.order.address}
					</div>
				</address>
			</dd>
		</div>
	</dl>
</div>
