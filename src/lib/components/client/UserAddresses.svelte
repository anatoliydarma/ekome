<script lang="ts">
	import Loading from '$lib/components/Loading.svelte';
	import IconTrash from '~icons/tabler/trash';
	import { order } from '$lib/stores/shop';
	import { addressSchema } from '$lib/zod';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms/client';
	import type { Address } from './$types';
	import Helper from '$lib/components/Helper.svelte';
	import { COUNTRIES } from '$lib/consts';

	export let formData;

	let { form, errors, enhance, constraints, message, delayed } = superForm(formData.addressesForm, {
		validators: addressSchema,
		dataType: 'json',
		taintedMessage: null,
		validationMethod: 'submit-only',
		warnings: { noValidationAndConstraints: false }
	});

	let loading = false;
	let addresses: Address[];
	let selected: Address;
	let addNew: boolean = false;
	let selectedAddressId: number;
	$: if (addresses) {
		const addresse =
			addresses && addresses.length > 0 ? addresses.find((a) => a.id == selectedAddressId) : null;

		$order.client_address = `${addresse?.street}, ${addresse?.city}, ${addresse?.country}, ${addresse?.zip}, ${addresse?.etc}`;
	}
	$: $order.client_country =
		addresses && addresses.length > 0
			? addresses.find((a) => a.id == selectedAddressId)?.country
			: null;

	function setEditForm(address: Address) {
		addNew = false;

		if (selected == address) {
			selected = null;
		} else {
			selected = address;
			$form = { ...selected };
		}
	}

	async function deleteAddress(id: number) {
		!confirm('Are you sure?');

		loading = true;
		await fetch('/api/addresses', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: id })
		})
			.then((res) => res.json())
			.then((data) => {
				//console.log('data', data);
				loading = false;
				getAddresses();
			});
	}

	onMount(() => {
		getAddresses();
	});

	async function getAddresses() {
		loading = true;
		await fetch('/api/addresses', {
			method: 'get',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => res.json())
			.then((data) => {
				loading = false;
				addresses = data;
				selectedAddressId =
					!$order.client_address && addresses.length ? addresses[0].id : selectedAddressId;
			});
	}
</script>

<div class="pt-6">
	<div><Loading {loading} /></div>

	<div class="space-y-2">
		{#if addresses}
			<div class="space-y-2">
				{#each addresses as address}
					<div
						class="border bg-white rounded-lg p-4 {selectedAddressId === address.id
							? 'border-secondary-500'
							: 'border-primary-300'}"
					>
						<div class="flex items-center gap-4 justify-between">
							{#if selectedAddressId === address.id}
								<div class="flex items-center gap-4">
									<div class="bg-secondary-500 border-secondary-500 w-5 h-5 border rounded-full" />
								</div>
							{:else}
								<div class="relative flex items-center gap-4">
									<button
										on:click={() => (selectedAddressId = address?.id)}
										class="hover:bg-primary-100 w-5 h-5 border border-primary-500 rounded-full"
									/>
								</div>
							{/if}

							<div class="w-full max-w-xs truncate">
								{address?.street}, {address?.city}, {address?.country}
							</div>

							<button on:click={() => setEditForm(address)}>Edit</button>
						</div>

						{#if selected?.id == address.id}
							<div transition:slide>
								<div>
									<form
										method="POST"
										action="/api/addresses"
										class="pt-4"
										use:enhance={{
											onResult: ({ result, formEl, cancel }) => {
												if (result.type == 'success') {
													addNew = false;
													getAddresses();
												}
											}
										}}
									>
										<input type="hidden" name="id" bind:value={$form.id} />

										<div class="space-y-4">
											<div class="grid gap-4 grid-cols-2">
												<label class="label">
													<span>Country</span>
													<select
														class="select"
														disabled
														bind:value={$form.country}
														aria-invalid={$errors.country ? 'true' : undefined}
														{...$constraints.country}
														id="country"
														name="country"
													>
														{#each Object.entries(COUNTRIES) as [key, name]}
															<option value={key}>{name}</option>
														{/each}
													</select>

													{#if $errors.country}
														<Helper>{$errors.country}</Helper>
													{/if}
												</label>

												<label class="label">
													<span>City</span>
													<input
														class="input"
														type="text"
														name="city"
														placeholder="city"
														bind:value={$form.city}
														aria-invalid={$errors.city ? 'true' : undefined}
														{...$constraints.city}
													/>
													{#if $errors.city}
														<Helper>{$errors.city}</Helper>
													{/if}
												</label>

												<label class="label">
													<span>Street</span>
													<input
														class="input"
														type="text"
														name="street"
														placeholder="street"
														bind:value={$form.street}
														aria-invalid={$errors.street ? 'true' : undefined}
														{...$constraints.street}
													/>
													{#if $errors.street}
														<Helper>{$errors.street}</Helper>
													{/if}
												</label>

												<label class="label">
													<span>Posta/Zip code</span>
													<input
														class="input"
														type="text"
														name="zip"
														placeholder="zip"
														bind:value={$form.zip}
														aria-invalid={$errors.zip ? 'true' : undefined}
														{...$constraints.zip}
													/>
													{#if $errors.zip}
														<Helper>{$errors.zip}</Helper>
													{/if}
												</label>

												<div class="w-full col-span-2">
													<label class="label">
														<span>Etc</span>
														<textarea
															name="etc"
															placeholder="etc"
															class="textarea"
															bind:value={$form.etc}
															aria-invalid={$errors.etc ? 'true' : undefined}
															{...$constraints.etc}
														/>
														{#if $errors.etc}
															<Helper>{$errors.etc}</Helper>
														{/if}
													</label>
												</div>
											</div>
										</div>
										<div class="pt-4 flex justify-between">
											<div>
												{#if selectedAddressId !== address.id}
													<button
														class=" hover text-red-600"
														on:click={() => deleteAddress(address.id)}
														type="button"
													>
														<Loading {loading} />
														{#if !loading}
															<IconTrash />
														{/if}
													</button>
												{/if}
											</div>

											<button
												class="btn variant-filled-primary"
												on:click={() => ((selectedAddressId = address.id), setEditForm(address))}
												type="submit"
											>
												<Loading loading={$delayed} />

												Save
											</button>
										</div>
									</form>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<div>
			<div
				class="{addNew
					? 'border-primary-300 bg-white'
					: 'border-transparent'} border rounded-lg py-2"
			>
				<div class="flex">
					<button
						on:click={() => ((addNew = !addNew), ($form = { ...selected }))}
						class="{addNew
							? 'border-transparent'
							: 'border-primary-300 bg-white '} border rounded-lg px-4 py-2 hover:text-secondary-600"
						>Add new address</button
					>
				</div>

				{#if addNew}
					<div transition:slide class="px-4">
						<form
							method="POST"
							action="/api/addresses"
							class="pt-4"
							use:enhance={{
								onResult: ({ result }) => {
									if (result.type == 'success') {
										addNew = false;

										getAddresses();
									}
								}
							}}
						>
							<div class="space-y-4">
								<div class="grid gap-4 grid-cols-2">
									<label class="label">
										<span>Country</span>

										<select
											disabled
											class="select"
											bind:value={$form.country}
											aria-invalid={$errors.country ? 'true' : undefined}
											{...$constraints.country}
											name="country"
										>
											{#each Object.entries(COUNTRIES) as [key, name]}
												<option value={key}>{name}</option>
											{/each}
										</select>
										{#if $errors.country}
											<Helper>{$errors.country}</Helper>
										{/if}
									</label>

									<label class="label">
										<span>City</span>
										<input
											class="input"
											type="text"
											name="city"
											placeholder="city"
											bind:value={$form.city}
											aria-invalid={$errors.city ? 'true' : undefined}
											{...$constraints.city}
										/>
										{#if $errors.city}
											<Helper>{$errors.city}</Helper>
										{/if}
									</label>

									<label class="label">
										<span>Street</span>
										<input
											class="input"
											type="text"
											name="street"
											placeholder="street"
											bind:value={$form.street}
											aria-invalid={$errors.street ? 'true' : undefined}
											{...$constraints.street}
										/>
										{#if $errors.street}
											<Helper>{$errors.street}</Helper>
										{/if}
									</label>

									<label class="label">
										<span>Posta/Zip code</span>
										<input
											class="input"
											type="text"
											name="zip"
											placeholder="zip"
											bind:value={$form.zip}
											aria-invalid={$errors.zip ? 'true' : undefined}
											{...$constraints.zip}
										/>
										{#if $errors.zip}
											<Helper>{$errors.zip}</Helper>
										{/if}
									</label>

									<div class="w-full col-span-2">
										<label class="label">
											<span>Etc</span>
											<textarea
												name="etc"
												placeholder="etc"
												class="textarea"
												bind:value={$form.etc}
												aria-invalid={$errors.etc ? 'true' : undefined}
												{...$constraints.etc}
											/>
											{#if $errors.etc}
												<Helper>{$errors.etc}</Helper>
											{/if}
										</label>
									</div>
								</div>
							</div>
							<div class="pt-4 flex justify-between">
								<button
									on:click={() => (addNew = false)}
									class="border border-primary-300 rounded-lg px-4 py-2 hover:border-primary-600"
									>Close</button
								>
								<button type="submit" class="btn variant-filled-primary">
									<Loading loading={$delayed} />
									Save
								</button>
							</div>
						</form>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
