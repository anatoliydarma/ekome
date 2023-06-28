<script lang="ts">
	import IconChevronLeft from '~icons/tabler/chevron-left';
	import { superForm } from 'sveltekit-superforms/client';
	import Helper from '$lib/components/Helper.svelte';
	export let data;

	const { form, errors, enhance, constraints, message } = superForm(data.form);
</script>

<svelte:head>
	<title>Add new property</title>
</svelte:head>
<main class="h-full overflow-y-auto">
	<div class="container px-6 flex gap-6 items-center">
		<a href="/admin/categories/" class="hover">
			<IconChevronLeft class="dark:text-stone-100" />
		</a>
		<h2 class="my-6 text-2xl font-semibold text-stone-700 dark:text-stone-200">Add new property</h2>
	</div>

	<div class="px-6 flex gap-6">
		<form method="POST" action="?/save" use:enhance class="container max-w-screen-lg">
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
							placeholder="Property name"
						/>
						{#if $errors.name}
							<Helper>{$errors.name}</Helper>
						{/if}
					</div>
				</div>
			</div>
			<div class="pt-6 flex justify-between">
				<button type="submit" class="btn variant-filled">
					{#if $form.id}
						Save
					{:else}
						Create
					{/if}
				</button>
			</div>
		</form>
		{#if $form.id}
			<form action="?/delete" method="POST" use:enhance>
				<input type="hidden" name="id" bind:value={$form.id} />
				<button type="submit" class="btn variant-filled-error">Delete</button>
			</form>
		{/if}
	</div>
</main>
