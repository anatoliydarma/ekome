<script lang="ts">
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import Uploader from '$lib/components/Uploader.svelte';
	import IconChevronLeft from '~icons/tabler/chevron-left';
	import { superForm } from 'sveltekit-superforms/client';
	import Helper from '$lib/components/Helper.svelte';
	export let data;

	const { form, errors, enhance, constraints, message } = superForm(data.form);
</script>

<svelte:head>
	<title>Add new category</title>
</svelte:head>
<main class="h-full overflow-y-auto">
	<div class="container px-6 flex gap-6 items-center">
		<a href="/admin/categories/" class="hover">
			<IconChevronLeft class="dark:text-primary-100" />
		</a>
		<h2 class="my-6 text-2xl font-semibold text-primary-700 dark:text-primary-200">
			Add new category
		</h2>
	</div>

	<div class="px-6 max-w-screen-md">
		<form method="POST" action="?/save" use:enhance>
			<input type="hidden" name="id" value={$form.id} />

			<div class="space-y-4">
				<div class="flex gap-6 flex-wrap max-w-2xl">
					<div class="w-full max-w-xs">
						<label for="name" class="block pb-1 label">Name</label>
						<input
							class="input"
							type="text"
							bind:value={$form.name}
							aria-invalid={$errors.name ? 'true' : undefined}
							{...$constraints.name}
							id="name"
							name="name"
							placeholder="Category name"
						/>
						{#if $errors.name}
							<Helper>{$errors.name}</Helper>
						{/if}
					</div>

					<div class="w-full max-w-xs">
						<label for="sort" class="block pb-1 label">Sort</label>
						<input
							type="number"
							class="input"
							bind:value={$form.sort}
							aria-invalid={$errors.sort ? 'true' : undefined}
							{...$constraints.sort}
							id="sort"
							name="sort"
							placeholder="sort"
						/>
						{#if $errors.sort}
							<Helper>{$errors.sort}</Helper>
						{/if}
					</div>

					<div class="w-full max-w-xs">
						<label for="desc" class="block pb-1 label">Desc</label>
						<textarea
							bind:value={$form.desc}
							aria-invalid={$errors.desc ? 'true' : undefined}
							{...$constraints.desc}
							id="desc"
							name="desc"
							placeholder="desc"
							class="textarea"
						/>
						{#if $errors.desc}
							<Helper>{$errors.desc}</Helper>
						{/if}
					</div>

					<div class="w-full max-w-xs pt-6">
						<SlideToggle name="status" bind:checked={$form.status} active="bg-primary-500"
							>Status</SlideToggle
						>
					</div>
				</div>
				<div class="flex gap-2">
					<div class="w-full">
						<label for="image" class="block pb-1 label">Image</label>

						<Uploader bind:uploaded={$form.image} filename={$form.slug} name={'image'} />

						{#if $errors.image}
							<Helper>{$errors.image}</Helper>
						{/if}
					</div>
				</div>
			</div>
			<div class="pt-6 flex justify-end gap-6">
				{#if $form.id}
					<form action="?/delete" method="POST" use:enhance>
						<input type="hidden" name="id" bind:value={$form.id} />
						<button
							on:click={(e) => !confirm('Are you sure?') && e.preventDefault()}
							type="submit"
							class="btn variant-ringed-error">Delete</button
						>
					</form>
				{/if}

				<button type="submit" class="btn variant-filled">
					{#if $form.id}
						Save
					{:else}
						Create
					{/if}
				</button>
			</div>
		</form>
	</div>
</main>
