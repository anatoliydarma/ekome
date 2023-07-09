<script lang="ts">
	import IconShoppingCart from '~icons/tabler/shopping-cart';
	export let data;
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<main class="h-full overflow-y-auto">
	<div class="container px-6 mx-auto grid">
		<h3>Dashboard</h3>

		<!-- Cards -->
		<div class="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
			<!-- Card -->
			<div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-surface-800">
				<div
					class="p-3 mr-4 text-secondary-500 bg-secondary-100 rounded-full dark:text-secondary-100 dark:bg-secondary-500"
				>
					<IconShoppingCart />
				</div>
				<div>
					<p class="mb-2 text-sm font-medium text-primary-600 dark:text-primary-400">
						Total orders
					</p>
					<p class="text-lg font-semibold text-primary-700 dark:text-primary-200">
						{data.ordersCount}
					</p>
				</div>
			</div>
		</div>

		<!-- Charts -->
		<h3>Charts</h3>
		<div class="grid gap-6 mb-8 md:grid-cols-2">
			<div class="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-surface-800">
				<h4 class="mb-4 font-semibold text-primary-800 dark:text-primary-300">Revenue</h4>
				<canvas id="pie" />
				<div
					class="flex justify-center mt-4 space-x-3 text-sm text-primary-600 dark:text-primary-400"
				>
					<!-- Chart legend -->
					<div class="flex items-center">
						<span class="inline-block w-3 h-3 mr-1 bg-blue-500 rounded-full" />
						<span>Shirts</span>
					</div>
					<div class="flex items-center">
						<span class="inline-block w-3 h-3 mr-1 bg-teal-600 rounded-full" />
						<span>Shoes</span>
					</div>
					<div class="flex items-center">
						<span class="inline-block w-3 h-3 mr-1 bg-purple-600 rounded-full" />
						<span>Bags</span>
					</div>
				</div>
			</div>
			<div class="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-surface-800">
				<h4 class="mb-4 font-semibold text-primary-800 dark:text-primary-300">Traffic</h4>
				<canvas id="line" />
				<div
					class="flex justify-center mt-4 space-x-3 text-sm text-primary-600 dark:text-primary-400"
				>
					<!-- Chart legend -->
					<div class="flex items-center">
						<span class="inline-block w-3 h-3 mr-1 bg-teal-600 rounded-full" />
						<span>Organic</span>
					</div>
					<div class="flex items-center">
						<span class="inline-block w-3 h-3 mr-1 bg-purple-600 rounded-full" />
						<span>Paid</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
