<script lang="ts">
	import { FileDropzone, toastStore } from '@skeletonlabs/skeleton';

	import IconCloudUpload from '~icons/tabler/cloud-upload';
	import IconX from '~icons/tabler/x';
	import IconLoader2 from '~icons/tabler/loader-2';

	import Sortlist from './Sortlist.svelte';

	export let uploaded: string[] = [];
	export let name: string = 'image';
	export let filename: string = 'image';
	export let multiple: boolean = false;

	let files: any;
	let loading: boolean = false;

	const handleUpload = async () => {
		loading = true;
		const formData = new FormData();

		for (let i = 0; i < files.length; i++) {
			formData.append('images', files[i]);
		}

		formData.append('name', filename);

		await fetch('/api/upload', {
			method: 'POST',
			body: formData
		})
			.then((response) => response.json())
			.then((data) => {
				uploaded = uploaded ? uploaded : [];

				uploaded.push(...data);
				uploaded = uploaded;
				loading = false;
			})
			.catch((err) => {
				loading = false;
				console.error(err);
			});
	};
	const handleRemoveFile = async (image: string, i: number) => {
		await fetch('/api/upload', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				filename: image
			})
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success == true) {
					toastStore.trigger({
						message: 'File was deleted',
						background: 'variant-filled-success'
					});
				} else {
					toastStore.trigger({
						message: 'File was not deleted',
						background: 'variant-ghost-error'
					});
				}
				uploaded.splice(i, 1);

				uploaded = uploaded.length < 1 ? [] : uploaded;
			})
			.catch((err) => {
				console.error(err);
			});
	};
</script>

<div class="flex gap-4 items-center flex-wrap">
	<FileDropzone
		name="files"
		bind:files
		accept="image/*"
		on:change={handleUpload}
		{multiple}
		class="w-32 h-32"
	>
		<svelte:fragment slot="lead">
			<div class="flex justify-center">
				{#if loading}
					<IconLoader2 class="text-lime-500 animate-spin" />
				{:else}
					<IconCloudUpload class="text-stone-500 dark:text-stone-400" />
				{/if}
			</div>
		</svelte:fragment>
		<svelte:fragment slot="message">
			<span class="text-xs">Click to upload or drag and drop</span>
		</svelte:fragment>
	</FileDropzone>

	<input type="hidden" {name} bind:value={uploaded} />

	{#if uploaded && uploaded?.length > 0}
		<Sortlist bind:list={uploaded} let:item let:index>
			<div class="relative w-32 h-32 group">
				<!-- svelte-ignore a11y-img-redundant-alt -->
				<img
					src="/assets/{item}"
					alt="image"
					class="object-cover w-32 h-32 rounded-lg cursor-move"
				/>

				<button
					type="button"
					on:click={() => handleRemoveFile(item, index)}
					class="absolute -top-3 -right-3 text-stone-600 rounded-full bg-white p-1 hover:text-red-600 invisible group-hover:visible"
				>
					<IconX class="w-5 h-5" />
				</button>
			</div>
		</Sortlist>
	{/if}
</div>
