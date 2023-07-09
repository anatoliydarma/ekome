<script lang="ts">
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let open = false;
	function toggle() {
		open = !open;

		if (!open) {
			dispatch('close');
		}
	}
</script>

<div class="relative">
	<button on:click={() => toggle()}>
		<slot name="trigger" />
	</button>

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	{#if open}
		<div
			transition:fade
			on:click={() => toggle()}
			role="button"
			tabindex="0"
			class="fixed top-0 bottom-0 left-0 right-0 z-40 w-screen h-screen overflow-hidden bg-primary-900/30 cursor-pointer pointer-events-auto transition-all duration-500 backdrop-blur-sm"
		/>
	{/if}

	<div
		class="{open ? 'translate-x-0' : 'translate-x-full'}
            fixed top-0 right-0 z-50 h-screen text-primary-700 dark:text-surface-300 transition-all duration-700 ease-in-out transform bg-white dark:bg-surface-800 w-full max-w-screen-md"
	>
		<div class="flex flex-col justify-between h-screen">
			<slot name="content" />
		</div>
	</div>
</div>
