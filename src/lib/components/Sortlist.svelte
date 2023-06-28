<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';

	export let list: string[] = [];
	const dispatch = createEventDispatcher();

	let hovering = null;
	let tag = 'div';

	const drop = (event, target) => {
		event.dataTransfer.dropEffect = 'move';
		const start = parseInt(event.dataTransfer.getData('text/plain'));
		const newTracklist = list;

		if (start < target) {
			newTracklist.splice(target + 1, 0, newTracklist[start]);
			newTracklist.splice(start, 1);
		} else {
			newTracklist.splice(target, 0, newTracklist[start]);
			newTracklist.splice(start + 1, 1);
		}
		list = newTracklist;
		hovering = null;
	};

	const dragstart = (event, i) => {
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.dropEffect = 'move';
		const start = i;
		event.dataTransfer.setData('text/plain', start);
	};

	//dispatch('reorder', { source, target });
</script>

{#each list as item, index (item)}
	<div
		animate:flip={{ delay: 0, duration: 500, easing: quintOut }}
		draggable={true}
		on:dragstart={(event) => dragstart(event, index)}
		on:drop|preventDefault={(event) => drop(event, index)}
		ondragover="return false"
		on:dragenter={() => (hovering = index)}
		class="{hovering === index ? 'opacity-50' : ''} rounded-lg"
	>
		<slot {item} {index} />
	</div>
{/each}
