<script>
	import IconUserCircle from '~icons/tabler/user-circle';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Cart from '$lib/components/client/Cart.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { createEventDispatcher } from 'svelte';
	import Search from '$lib/components/form/Search.svelte';

	export let duration = '500ms';
	export let offset = 0;
	export let tolerance = 0;
	export let data;

	let headerClass = 'pin';
	let lastHeaderClass = 'pin';
	let y = 0;
	let lastY = 0;

	const dispatch = createEventDispatcher();

	function deriveClass(y = 0, scrolled = 0) {
		if (y < offset) return 'pin';
		if (!scrolled || Math.abs(scrolled) < tolerance) return headerClass;
		const dir = scrolled < 0 ? 'down' : 'up';
		if (dir === 'up') return 'pin';
		if (dir === 'down') return 'unpin';
		return headerClass;
	}

	function updateClass(y = 0) {
		const scrolledPxs = lastY - y;
		const result = deriveClass(y, scrolledPxs);
		lastY = y;
		return result;
	}

	function action(node) {
		node.style.transitionDuration = duration;
	}

	$: {
		headerClass = updateClass(y);
		if (headerClass !== lastHeaderClass) {
			dispatch(headerClass);
		}
		lastHeaderClass = headerClass;
	}
</script>

<svelte:window bind:scrollY={y} />
<div use:action class="{headerClass} fixed w-full top-0 transition-all z-50">
	<nav class="bg-white dark:bg-stone-900 border-b border-stone-100">
		<div class="max-w-screen-xl flex px-4 items-center justify-between mx-auto">
			<a href="/" class="flex items-center">
				<Logo class="h-6 sm:h-9" />
			</a>
			<button
				data-collapse-toggle="navbar-default"
				type="button"
				class="inline-flex items-center p-2 ml-3 text-sm text-stone-500 rounded-lg md:hidden hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-200 dark:text-stone-400 dark:hover:bg-stone-700 dark:focus:ring-stone-600"
				aria-controls="navbar-default"
				aria-expanded="false"
			>
				<span class="sr-only">Open main menu</span>
				<svg
					class="w-6 h-6"
					aria-hidden="true"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
						clip-rule="evenodd"
					/></svg
				>
			</button>

			<div class="max-w-sm w-full">
				<Search />
			</div>

			<div class="hidden w-full md:block md:w-auto" id="navbar-default">
				<ul
					class="flex flex-col md:items-center p-4 border border-stone-100 rounded-lg bg-stone-50 md:flex-row md:space-x-8 md:border-0 md:bg-white dark:bg-stone-800 md:dark:bg-stone-900 dark:border-stone-700"
				>
					<li>
						<a
							href="/"
							class="permalink block py-2 pl-3 pr-4 text-stone-700 rounded hover:bg-stone-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-stone-400 md:dark:hover:text-white dark:hover:bg-stone-700 dark:hover:text-white md:dark:hover:bg-transparent"
							>Products</a
						>
					</li>

					<Cart cart={data.cart} user={data.user} />

					{#if !data.user}
						<li>
							<a
								href="/login"
								class="block permalink py-2 pl-3 pr-4 text-stone-700 rounded hover:bg-stone-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-stone-400 md:dark:hover:text-white dark:hover:bg-stone-700 dark:hover:text-white md:dark:hover:bg-transparent"
								>Login</a
							>
						</li>
					{:else}
						<Dropdown>
							<div slot="trigger">
								<IconUserCircle size={32} stroke={1.5} class="dark:text-stone-100" />
							</div>

							<div slot="content" class="grid gap-2 bg-stone-50 rounded-md p-4">
								<a href="/account" class="hover:underline permalink">Account</a>
								<a href="/account/orders" class="hover:underline permalink">Orders</a>
								{#if data.user.role !== 'client'}
									<a href="/admin" class="hover:underline permalink"> Dashboard</a>
								{/if}

								<a
									data-sveltekit-preload-data="off"
									href="/logout"
									class="hover:underline permalink"
								>
									Logout</a
								>
							</div>
						</Dropdown>
					{/if}
				</ul>
			</div>
		</div>
	</nav>
</div>

<style>
	.pin {
		transform: translateY(0%);
	}

	.unpin {
		transform: translateY(-100%);
	}
</style>
