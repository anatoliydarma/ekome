<script lang="ts">
	import Header from '$lib/components/client/Header.svelte';
	import Footer from '$lib/components/client/Footer.svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	export let data;
</script>

<Header bind:data />

{#if data.user && !data.user?.verified}
	<div
		class="fixed bottom-4 left-4 mx-auto max-w-lg rounded-xl bg-yellow-50 p-4 text-sm shadow-md z-50"
	>
		<div class="flex gap-4">
			<div
				class="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-200 text-yellow-500"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="h-6 w-6"
				>
					<path
						fill-rule="evenodd"
						d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
			<div class="grid gap-2 pr-6">
				<div>Please, verified your email vie the link that we sent you to your email.</div>
				<div>
					If you did not get the email. You can resend it again <a
						href="/verify-email"
						class="text-sky-600 hover:underline">here</a
					>.
				</div>
			</div>
		</div>
	</div>
{/if}

{#key data.url}
	<div in:fade={{ duration: 200, delay: 200 }} out:fade={{ duration: 200 }}>
		<div class="py-24">
			<slot />
		</div>
	</div>
{/key}

<Footer />
