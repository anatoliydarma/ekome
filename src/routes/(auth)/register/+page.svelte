<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { userSchema } from '$lib/zod';
	import Helper from '$lib/components/Helper.svelte';
	import IconLoader2 from '~icons/tabler/loader-2';
	export let data;

	const signUpSchema = userSchema.pick({
		email: true,
		password: true
	});

	const { form, errors, enhance, delayed, constraints } = superForm(data.form, {
		taintedMessage: null,
		validators: signUpSchema,
		delayMs: 0
	});
</script>

<div class="flex justify-center flex-col space-y-6 lg:w-80">
	<div class="text-center">
		<h2 class="text-2xl font-bold tracking-tight text-primary-900 unstyled">Register</h2>
		<p class="mt-2 text-sm text-primary-600">
			Already have an account?
			<a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">Login</a>
		</p>
	</div>

	<div class="mt-6">
		<form method="POST" class="space-y-4" use:enhance>
			<label class="label">
				<span>Email address</span>
				<input
					bind:value={$form.email}
					aria-invalid={$errors.email ? 'true' : undefined}
					class:input-error={$errors.email}
					{...$constraints.email}
					class="input"
					name="email"
					type="email"
					autocomplete="email"
					required
				/>
				{#if $errors.email}
					<Helper>{$errors.email}</Helper>
				{/if}
			</label>

			<label class="label">
				<span>Password</span>
				<input
					bind:value={$form.password}
					aria-invalid={$errors.password ? 'true' : undefined}
					class:input-error={$errors.password}
					{...$constraints.password}
					class="input w-full"
					name="password"
					type="password"
					autocomplete="current-password"
					required
				/>
				{#if $errors.password}
					<Helper>{$errors.password}</Helper>
				{/if}
			</label>

			<button
				type="submit"
				class="btn variant-filled-primary w-full flex gap-1 items-center"
				disabled={$delayed}
			>
				{#if $delayed}
					<IconLoader2 />
				{/if}
				Sign up
			</button>
		</form>
	</div>
</div>
