<script lang="ts">
	import { clickOutside } from '$lib/client/utils';
	import IconChevronDown from '~icons/tabler/chevron-down';

	export let open: boolean = false;

	function toggle() {
		open = !open;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="relative" use:clickOutside on:click-outside={() => (open = false)}>
	<button on:click={() => toggle()} class="flex gap-1 items-center">
		<slot name="trigger" />

		<IconChevronDown class="{open ? 'rotate-180' : ''} transition-all duration-300 w-4 h-4" />
	</button>

	{#if open}
		<div
			on:click={() => (open = false)}
			role="button"
			tabindex="0"
			class="absolute z-50 mt-2 w-48 rounded-md shadow-lg right-0 transition duration-300"
		>
			<slot name="content" />
		</div>
	{/if}
</div>
