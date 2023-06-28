<script lang="ts">
	import IconChevronLeft from '~icons/tabler/chevron-left';
	import IconTrash from '~icons/tabler/trash';
	import Svelecte from 'svelecte';
	import { superForm } from 'sveltekit-superforms/client';
	import dayjs from 'dayjs';
	import Helper from '$lib/components/Helper.svelte';
	import SelectQty from '$lib/components/SelectQty.svelte';
	import { toastStore, SlideToggle } from '@skeletonlabs/skeleton';
	import { getCostOfDeliveryAndVat } from '$lib/utils';
	import { BOX_WEIGHT } from '$lib/consts';

	export let data;

	const { form, errors, enhance, constraints } = superForm(data.form, {
		dataType: 'json'
	});

	const users = data.users;
	let selectedUserId: string = $form.user_id;
	let autoCalc = false;

	$: if (selectedUserId) {
		$form.user_id = selectedUserId;
	}

	$: if (autoCalc) {
		$form.amount = $form.items?.reduce(
			(total: number, item: OrderItem) => total + item.price * item.qty,
			0
		);
	}

	$: $form.weight =
		$form.items?.reduce(
			(total: number, item: OrderItem) => Number(item.weight) * Number(item.qty) + Number(total),
			0
		) + BOX_WEIGHT;

	$: totalQty = $form.items?.reduce((total: number, item: OrderItem) => total + item.qty, 0);

	$: if ($form.client_country && $form.amount > 0 && autoCalc) {
		let calcCost = getCostOfDeliveryAndVat($form);
		$form.shipping_cost = Number(calcCost.shipping);
		$form.tax_cost = Number(calcCost.vat);
	}

	let selectedProduct: Product | null = null;

	function addItem() {
		if (
			selectedProduct &&
			!$form.items?.find(function (i) {
				return i.product_id == selectedProduct?.id;
			})
		) {
			$form.items.push({
				qty: Number(selectedProduct?.min_qty),
				price: selectedProduct.price,
				product_id: Number(selectedProduct.id),
				name: selectedProduct.name,
				unit: selectedProduct.unit,
				min_qty: Number(selectedProduct.min_qty),
				weight: Number(selectedProduct.weight)
			});
			$form.items = $form.items;
		} else {
			toastStore.trigger({
				message: 'Product is already in the order',
				background: 'variant-ghost-error'
			});
		}

		selectedProduct = null;
	}

	function removeItem(index: number) {
		$form.items.splice(index, 1);
		$form.items = $form.items;
	}

	function setQty(event: { detail: number }, index: number) {
		$form.items[index].qty = event.detail;
	}

	function getCost(item: CartItem) {
		return (item.price * item.qty).toFixed(1);
	}
</script>

<svelte:head>
	<title>Order</title>
</svelte:head>
<main class="h-full overflow-y-auto space-y-8">
	<div class="max-w-screen-lg flex gap-6 items-center justify-between">
		<div class="flex gap-6 items-center">
			<a href="/admin/orders/" class="hover">
				<IconChevronLeft class="dark:text-stone-100" />
			</a>
			<h5>
				{#if $form.id}
					Order id: {$form.id} | {dayjs($form.created_at).format('D MMM YYYY')}
				{:else}
					New order
				{/if}
			</h5>
		</div>
		<h5>
			Total: € {(
				Number($form.amount) +
				Number($form.shipping_cost) +
				Number($form.tax_cost)
			).toFixed(1)} / {$form.weight / 1000} kg
		</h5>
	</div>

	<div class="px-6 grid gap-6">
		<form method="POST" action="?/save" use:enhance class="max-w-screen-lg">
			<input type="hidden" name="id" value={$form.id} />

			<div class="space-y-4">
				<div class="grid gap-x-6 gap-y-4 grid-cols-3">
					<div
						class="col-span-3 grid gap-x-6 gap-y-4 grid-cols-4 items-end pb-6 bg-surface-600 px-6 pt-4 rounded-lg"
					>
						<div class="">
							<SlideToggle active="bg-primary-500" name="slide" bind:checked={autoCalc} size="sm">
								Auto calc
							</SlideToggle>
						</div>
						<div>
							<label for="amount" class="block pb-1 label">Amount</label>
							<input
								class="input"
								bind:value={$form.amount}
								aria-invalid={$errors.amount ? 'true' : undefined}
								{...$constraints.amount}
								readonly={autoCalc}
								id="amount"
								name="amount"
								type="number"
								placeholder="amount"
							/>
							{#if $errors.amount}
								<Helper>{$errors.amount}</Helper>
							{/if}
						</div>
						<div>
							<label for="shipping_cost" class="block pb-1 label">Shipping cost</label>
							<input
								class="input"
								bind:value={$form.shipping_cost}
								aria-invalid={$errors.shipping_cost ? 'true' : undefined}
								{...$constraints.shipping_cost}
								readonly={autoCalc}
								id="shipping_cost"
								name="shipping_cost"
								type="number"
								placeholder="Shipping cost"
							/>
							{#if $errors.shipping_cost}
								<Helper>{$errors.shipping_cost}</Helper>
							{/if}
						</div>
						<div>
							<label for="tax_cost" class="block pb-1 label">Tax cost</label>
							<input
								class="input"
								bind:value={$form.tax_cost}
								aria-invalid={$errors.tax_cost ? 'true' : undefined}
								{...$constraints.tax_cost}
								readonly={autoCalc}
								id="tax_cost"
								name="tax_cost"
								type="number"
								placeholder="Tax cost"
							/>
							{#if $errors.tax_cost}
								<Helper>{$errors.tax_cost}</Helper>
							{/if}
						</div>
					</div>

					<div>
						<label class="block pb-1 label">Client</label>
						<input type="hidden" name="user_id" value={$form.user_id} />
						<Svelecte
							clearable={true}
							multiple={false}
							minQuery={3}
							labelField={'email'}
							bind:value={selectedUserId}
							fetch="/api/users?search=[query]"
						/>
						{#if $errors.user_id}
							<Helper>{$errors.user_id}</Helper>
						{/if}
					</div>

					<div>
						<label for="client_name" class="block pb-1 label">Client name</label>
						<input
							class="input"
							type="text"
							bind:value={$form.client_name}
							aria-invalid={$errors.client_name ? 'true' : undefined}
							{...$constraints.client_name}
							id="client_name"
							name="client_name"
							placeholder="Client name"
						/>
						{#if $errors.client_name}
							<Helper>{$errors.client_name}</Helper>
						{/if}
					</div>

					<label class="label">
						<span>Country</span>
						<select
							class="select"
							bind:value={$form.client_country}
							aria-invalid={$errors.client_country ? 'true' : undefined}
							{...$constraints.client_country}
							id="country"
							name="country"
						>
							{#each Object.entries(data.countries) as [key, name]}
								<option value={key}>{name}</option>
							{/each}
						</select>

						{#if $errors.client_country}
							<Helper>{$errors.client_country}</Helper>
						{/if}
					</label>

					<div>
						<label for="client_email" class="block pb-1 label">Client email</label>
						<input
							class="input"
							bind:value={$form.client_email}
							aria-invalid={$errors.client_email ? 'true' : undefined}
							{...$constraints.client_email}
							type="email"
							id="client_email"
							name="client_email"
							placeholder="Client email"
						/>
						{#if $errors.client_email}
							<Helper>{$errors.client_email}</Helper>
						{/if}
					</div>

					<div>
						<label for="client_phone" class="block pb-1 label">Client phone</label>
						<input
							class="input"
							type="text"
							bind:value={$form.client_phone}
							aria-invalid={$errors.client_phone ? 'true' : undefined}
							{...$constraints.client_phone}
							id="client_phone"
							name="client_phone"
							placeholder="Client phone"
						/>
						{#if $errors.client_phone}
							<Helper>{$errors.client_phone}</Helper>
						{/if}
					</div>

					<div>
						<label for="client_address" class="block pb-1 label">Client address</label>
						<input
							class="input"
							type="text"
							bind:value={$form.client_address}
							aria-invalid={$errors.client_address ? 'true' : undefined}
							{...$constraints.client_address}
							id="client_address"
							name="client_address"
							placeholder="Client address "
						/>
						{#if $errors.client_address}
							<Helper>{$errors.client_address}</Helper>
						{/if}
					</div>

					<div class="pt-6">
						<label for="status" class="block pb-1 label">Status</label>
						<select
							class="select"
							bind:value={$form.status}
							aria-invalid={$errors.status ? 'true' : undefined}
							{...$constraints.status}
							id="status"
							name="status"
						>
							{#each data.statuses as status, i}
								<option value={status.value}>{status.name}</option>
							{/each}
						</select>
						{#if $errors.status}
							<Helper>{$errors.status}</Helper>
						{/if}
					</div>

					<div class="pt-6">
						<label for="tracker_number" class="block pb-1 label">Tracker number</label>
						<input
							class="input"
							type="text"
							bind:value={$form.tracker_number}
							aria-invalid={$errors.tracker_number ? 'true' : undefined}
							{...$constraints.tracker_number}
							id="tracker_number"
							name="tracker_number"
							placeholder="Tracker number"
						/>
						{#if $errors.tracker_number}
							<Helper>{$errors.tracker_number}</Helper>
						{/if}
					</div>

					<div />
				</div>
			</div>

			<div class="pt-12 space-y-6">
				<div class="max-w-md flex gap-4 items-center justify-end">
					<Svelecte
						clearable={true}
						multiple={false}
						minQuery={3}
						valueAsObject
						fetch="/api/products?search=[query]&paginate=0"
						bind:value={selectedProduct}
					/>
					<button
						type="button"
						class="btn variant-filled"
						disabled={selectedProduct == null}
						on:click={() => addItem()}
					>
						Add product
					</button>
				</div>

				<div class="max-w-screen-xl">
					<table class="table table-hover">
						<thead>
							<tr>
								<th>Product name</th>
								<th>Unit</th>
								<th>Order qty / {totalQty}</th>
								<th>Price</th>
								<th>Total</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{#if $form.items?.length}
								{#each $form.items as _, i}
									<tr>
										<td>{$form.items?.[i]?.name}</td>
										<td>{$form.items?.[i]?.unit}</td>
										<td>
											<SelectQty
												minQty={$form.items?.[i]?.min_qty}
												on:set-qty={(event) => setQty(event, i)}
												isInCart={true}
											/>
										</td>
										<td>€ {$form.items?.[i]?.price}</td>
										<td>€ {getCost($form.items[i])}</td>
										<td>
											<button
												on:click={(e) =>
													confirm('Are you sure?') && e.preventDefault(removeItem(i))}
												type="button"
												class="btn hover"
											>
												<IconTrash />
											</button>
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
			</div>

			<div class="pt-6 flex justify-between">
				<button type="submit" class="btn variant-filled-secondary"> Save </button>
			</div>
		</form>

		{#if $form.id}
			<div class="flex justify-end">
				<form action="?/delete" method="POST" use:enhance>
					<input type="hidden" name="id" bind:value={$form.id} />
					<button
						on:click={(e) => !confirm('Are you sure?') && e.preventDefault()}
						type="submit"
						class="btn variant-filled-error">Delete</button
					>
				</form>

				<!-- <form action="?/sendEmail" method="POST" use:enhance>
				<input type="hidden" name="id" bind:value={$form.id} />
				<button type="submit" class="btn variant-filled-secondary">Send email</button>
			</form> -->
			</div>
		{/if}
	</div>

	<form action="?/sendMessage" method="POST" use:enhance>
		<input type="hidden" name="id" bind:value={$form.id} />
		<button type="submit" class="btn variant-filled-secondary">Send Message</button>
	</form>
</main>
