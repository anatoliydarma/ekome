<script lang="ts">
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	export let form;
	export let data;
</script>

<div class="flex justify-center flex-col space-y-6 lg:w-80">
	<div class="flex flex-col items-center justify-center">
		{#if data.user && data.user.email_verified}
			<div class="pt-2 text-lime-600">
				Your email was verified. You can start enjoying shoping on

				<a href="/" class="">
					{PUBLIC_APP_NAME}
				</a>
			</div>
		{:else}
			<form method="POST" class="space-y-6" use:enhance>
				<div>
					<button type="submit" class="btn variant-filled-primary">
						Send new verification link
					</button>
				</div>
			</form>
		{/if}

		{#if form?.success}
			<div class="pt-2 text-lime-600">We sent you new verification link to your email.</div>
		{/if}
		{#if $page.error}
			<div class="pt-2 text-red-600">{$page.error.message}</div>
		{/if}
	</div>
</div>
