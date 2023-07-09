<script lang="ts">
	import Uploader from '$lib/components/Uploader.svelte';
	import IconChevronLeft from '~icons/tabler/chevron-left';
	import { superForm } from 'sveltekit-superforms/client';
	import Select from 'svelte-select';
	import Helper from '$lib/components/Helper.svelte';
	import Editor from '$lib/components/form/Editor.svelte';

	export let data;
	const { form, errors, enhance, constraints, message } = superForm(data.form, {
		dataType: 'json'
	});
</script>

<svelte:head>
	<title>Add new product</title>
</svelte:head>

<main class="space-y-6">
	<div class="flex gap-6 items-center pl-1">
		<a href="/admin/products/" class="hover">
			<IconChevronLeft class="dark:text-primary-100" />
		</a>
		{#if $form.id}
			<h3>Edit {$form.name}</h3>
		{:else}
			<h3>Add new product</h3>
		{/if}
	</div>

	<div>
		<form method="POST" action="?/save" class="max-w-2xl" enctype="multipart/form-data" use:enhance>
			<input type="hidden" name="id" value={$form.id} />

			<div class="grid gap-6 grid-cols-2">
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
						placeholder="Product"
					/>
					{#if $errors.name}
						<Helper>{$errors.name}</Helper>
					{/if}
				</div>

				<div class="w-full max-w-xs">
					<label for="category" class="block pb-1 label">Category</label>

					<select
						class="select"
						bind:value={$form.category_id}
						aria-invalid={$errors.category_id ? 'true' : undefined}
						{...$constraints.category_id}
						id="category"
						name="category_id"
					>
						{#each data.categories as category}
							<option value={category.id}>{category.name}</option>
						{/each}
					</select>
					{#if $errors.category_id}
						<Helper>{$errors.category_id}</Helper>
					{/if}
				</div>

				<div class="w-full max-w-xs">
					<label for="unit" class="block pb-1 label">Unit</label>
					<select
						class="select"
						bind:value={$form.unit}
						aria-invalid={$errors.unit ? 'true' : undefined}
						{...$constraints.unit}
						id="unit"
						name="unit"
					>
						{#each data.units as unit}
							<option value={unit.value}>{unit.name}</option>
						{/each}
					</select>
					{#if $errors.unit}
						<Helper>{$errors.unit}</Helper>
					{/if}
				</div>

				<div class="w-full max-w-xs">
					<label for="min_qty" class="block pb-1 label">Min qty</label>
					<input
						class="input"
						bind:value={$form.min_qty}
						aria-invalid={$errors.min_qty ? 'true' : undefined}
						{...$constraints.min_qty}
						id="min_qty"
						name="min_qty"
						type="number"
						placeholder="50"
					/>
					{#if $errors.min_qty}
						<Helper>{$errors.min_qty}</Helper>
					{/if}
				</div>

				<div class="w-full max-w-xs">
					<label for="price" class="block pb-1 label">Price in rupee</label>
					<input
						class="input"
						bind:value={$form.price}
						aria-invalid={$errors.price ? 'true' : undefined}
						{...$constraints.price}
						id="price"
						name="price"
						type="number"
						placeholder="100"
					/>
					{#if $errors.price}
						<Helper>{$errors.price}</Helper>
					{/if}
				</div>

				<div class="w-full max-w-xs">
					<label for="gst" class="block pb-1 label">GST %</label>
					<select
						class="select"
						bind:value={$form.gst}
						aria-invalid={$errors.gst ? 'true' : undefined}
						{...$constraints.gst}
						id="gst"
						name="gst"
					>
						{#each data.gst as item}
							<option value={item.key}>{item.value}</option>
						{/each}
					</select>
					{#if $errors.gst}
						<Helper>{$errors.gst}</Helper>
					{/if}
				</div>

				<div class="w-full max-w-xs">
					<label for="status" class="block pb-1 label">Status</label>
					<select
						class="select"
						bind:value={$form.status}
						aria-invalid={$errors.status ? 'true' : undefined}
						{...$constraints.status}
						id="status"
						name="status"
					>
						{#each data.productStatuses as status}
							<option value={status.value}>{status.name}</option>
						{/each}
					</select>
					{#if $errors.status}
						<Helper>{$errors.status}</Helper>
					{/if}
				</div>

				<div class="w-full col-span-2">
					<label for="desc" class="block pb-1 label">Description</label>

					<Editor bind:content={$form.desc} name="desc" />

					{#if $errors.desc}
						<Helper>{$errors.desc}</Helper>
					{/if}
				</div>

				<div class="w-full max-w-xs">
					<label for="sku" class="block pb-1 label">sku</label>
					<input
						class="input"
						bind:value={$form.sku}
						aria-invalid={$errors.sku ? 'true' : undefined}
						{...$constraints.sku}
						id="sku"
						name="sku"
						type="text"
						placeholder="sku"
					/>
					{#if $errors.sku}
						<Helper>{$errors.sku}</Helper>
					{/if}
				</div>

				<div class="w-full max-w-xs">
					<label for="upc" class="block pb-1 label">upc</label>
					<input
						class="input"
						bind:value={$form.upc}
						aria-invalid={$errors.upc ? 'true' : undefined}
						{...$constraints.upc}
						id="upc"
						name="upc"
						type="number"
						placeholder="upc"
					/>
					{#if $errors.upc}
						<Helper>{$errors.upc}</Helper>
					{/if}
				</div>

				<div class="w-full max-w-xs">
					<label for="brand" class="block pb-1 label">Brand</label>
					<select
						class="select"
						bind:value={$form.brand}
						aria-invalid={$errors.brand ? 'true' : undefined}
						{...$constraints.brand}
						id="brand"
						name="brand"
					>
						{#each data.brands as brand}
							<option value={brand.value}>{brand.name}</option>
						{/each}
					</select>
					{#if $errors.brand}
						<Helper>{$errors.brand}</Helper>
					{/if}
				</div>

				<div class="w-full max-w-xs">
					<label for="country" class="block pb-1 label">Country</label>

					<select
						class="select"
						bind:value={$form.country}
						aria-invalid={$errors.country ? 'true' : undefined}
						{...$constraints.country}
						id="country"
						name="country"
					>
						{#each Object.entries(data.countries) as [key, name]}
							<option value={key}>{name}</option>
						{/each}
					</select>
					{#if $errors.country}
						<Helper>{$errors.country}</Helper>
					{/if}
				</div>
			</div>

			<div class="w-full py-6 max-w-xs">
				<label for="properties" class="block pb-1 label">Properties</label>
				<Select
					items={data.properties}
					itemId="id"
					label="name"
					multiple
					name="properties"
					id="properties"
					bind:value={$form.properties}
				/>
			</div>

			<div class="w-full">
				<label for="images" class="block pb-1 label">Images</label>

				<Uploader
					bind:uploaded={$form.images}
					filename={$form.slug}
					name={'images'}
					multiple={true}
				/>

				{#if $errors.images}
					<Helper>{$errors.images}</Helper>
				{/if}
			</div>

			<div class="pt-12 flex justify-end gap-6">
				<div>
					{#if $form.id}
						<form action="?/delete" method="POST" use:enhance>
							<input type="hidden" name="id" bind:value={$form.id} />
							<button
								on:click={(e) => !confirm('Are you sure?') && e.preventDefault()}
								type="submit"
								class="btn variant-filled-error">Delete</button
							>
						</form>
					{/if}
				</div>
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
