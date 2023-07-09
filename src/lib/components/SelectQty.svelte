<script lang="ts">
	import IconPlus from '~icons/tabler/plus';
	import IconMinus from '~icons/tabler/minus';

	import { createEventDispatcher } from 'svelte';
	import { niceGrams } from '$lib/utils';
	const dispatch = createEventDispatcher();
	export let isInCart: boolean = false;
	export let minQty: number = 1;
	export let qty: number = 1;
	$: qty = minQty;

	function decrement() {
		qty = qty == minQty ? minQty : qty - minQty;
		dispatch('set-qty', qty);
	}

	function increment() {
		qty = qty + minQty;
		dispatch('set-qty', qty);
	}
</script>

<div>
	<div class="flex text-primary-600">
		<button
			type="button"
			on:click={decrement}
			aria-label="Decrement"
			class="{isInCart
				? 'px-2'
				: 'px-3 py-2'} hover:bg-primary-200 flex items-center justify-center text-xl bg-primary-100 border-y border-primary-100 rounded-l-md"
		>
			<IconMinus class="{isInCart ? 'w-5 h-5' : 'w-6 h-6'} stroke-current" />
		</button>
		<div
			class="{isInCart
				? 'text-sm px-2 w-14 py-2'
				: 'text-lg px-3 py-2 w-20'} focus:outline-none focus:ring-0 font-bold text-center border-y border-primary-100 focus:border-primary-200"
		>
			{niceGrams(qty)}
		</div>
		<button
			type="button"
			on:click={increment}
			aria-label="Increment"
			class="{isInCart
				? 'px-2'
				: 'px-3 py-2'} hover:bg-primary-200 flex items-center justify-center text-xl bg-primary-100 border-y border-primary-100 rounded-r-md"
		>
			<IconPlus class="{isInCart ? 'w-5 h-5' : 'w-6 h-6'} stroke-current" />
		</button>
	</div>
</div>
