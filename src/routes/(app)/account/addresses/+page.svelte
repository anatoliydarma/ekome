<script lang="ts">
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import UserAddresses from '$lib/components/client/UserAddresses.svelte';
	export let data;
</script>

<svelte:head>
	<title>My Addresses - {PUBLIC_APP_NAME}</title>
</svelte:head>

<main class="px-4 max-w-screen-xl mx-auto space-y-3">
	<h4>My Addresses</h4>
	<div class="max-w-lg">
		<UserAddresses formData={data} />
	</div>
</main>
