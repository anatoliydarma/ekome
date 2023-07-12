<script lang="ts">
	import { FileDropzone, toastStore } from '@skeletonlabs/skeleton';

	import IconCloudUpload from '~icons/tabler/cloud-upload';
	import IconX from '~icons/tabler/x';
	import IconLoader2 from '~icons/tabler/loader-2';

	import Sortlist from './Sortlist.svelte';
	import { getImageURL } from '$lib/client/utils';

	export let uploaded: string[] = null;
	export let name: string = 'image';
	export let multiple: boolean = false;
	export let collection: string = '';
	export let recordId: string | null = '';

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
	<FileDropzone {name} bind:files accept="image/*" {multiple} class="w-32 h-32">
		<svelte:fragment slot="lead">
			<div class="flex justify-center">
				{#if loading}
					<IconLoader2 class="text-lime-500 animate-spin" />
				{:else}
					<IconCloudUpload class="text-primary-500 dark:text-primary-400" />
				{/if}
			</div>
		</svelte:fragment>
		<svelte:fragment slot="message">
			<span class="text-xs">Click to upload or drag and drop</span>
		</svelte:fragment>
	</FileDropzone>

	{#if uploaded}
		{#if multiple}
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
						class="absolute -top-3 -right-3 text-primary-600 rounded-full bg-white p-1 hover:text-red-600 invisible group-hover:visible"
					>
						<IconX class="w-5 h-5" />
					</button>
				</div>
			</Sortlist>
		{:else if recordId}
			<div class="relative w-32 h-32 group">
				<!-- svelte-ignore a11y-img-redundant-alt -->
				<img
					src={getImageURL(collection, recordId, uploaded)}
					alt="image"
					class="object-cover w-32 h-32 rounded-lg cursor-move"
				/>
			</div>
		{/if}
	{/if}
</div>
