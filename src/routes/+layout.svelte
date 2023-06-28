<script lang="ts">
	import '../theme.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.css';

	import { Toast } from '@skeletonlabs/skeleton';
	import { ProgressBar } from '@prgm/sveltekit-progress-bar';
</script>

<Toast />
<ProgressBar class="text-lime-500 " />
<slot />
