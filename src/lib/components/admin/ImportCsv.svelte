<script>
	import papa from 'papaparse';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import { FileButton } from '@skeletonlabs/skeleton';
	import IconLoader2 from '~icons/tabler/loader-2';
	let files;
	let loading = false;

	const onChangeHandler = async () => {
		loading = true;

		await papa.parse(files[0], {
			header: true,
			dynamicTyping: true,
			complete: function (results) {
				uploadParsedData(results.data);
			}
		});
	};

	const uploadParsedData = async (parsedData) => {
		await fetch('/api/import', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(parsedData)
		})
			.then((response) => response.json())
			.then((data) => {
				loading = false;
				dispatch('close');
			})
			.catch((err) => {
				loading = false;
				console.error(err);
			});
	};
</script>

<div class="p-8 space-y-6">
	<div class="flex justify-start items-center gap-4">
		<div>Import CSV</div>
		{#if loading}
			<IconLoader2 class="text-lime-500 animate-spin" />
		{/if}
	</div>
	<FileButton
		name="files"
		bind:files
		on:change={onChangeHandler}
		accept=".csv"
		disabled={loading}
	/>
</div>
