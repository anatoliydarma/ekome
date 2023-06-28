<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import { PUBLIC_APP_NAME } from '$env/static/public';
</script>

<footer class="py-12 bg-stone-50-900-token border-t-8 border-stone-100">
	<div class="max-w-screen-xl px-4 mx-auto">
		<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
			<div>
				<a href="/">
					<Logo class="h-12" />
				</a>
			</div>

			<div>
				<h4 class="font-semibold text-stone-900 dark:text-stone-100">Shop</h4>

				<div class="mt-3 grid space-y-3 text-sm">
					<a class="text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 unstyled" href="/"
						>Soap</a
					>
					<a class="text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 unstyled" href="/"
						>Category</a
					>
					<a class="text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 unstyled" href="/"
						>Category</a
					>
				</div>
			</div>

			<div>
				<h4 class="font-semibold text-stone-900 dark:text-stone-100">Support</h4>

				<div class="mt-3 grid space-y-3 text-sm">
					<a
						class="text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 unstyled"
						href="/faq">FAQs</a
					>

					<a
						class="text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 unstyled"
						href="/"
					>
						Payment&amp; Delivery
					</a>

					<a class="text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 unstyled" href="/"
						>Contact Us</a
					>
				</div>
			</div>

			<div>
				<h4 class="font-semibold text-stone-900 dark:text-stone-100">Legal</h4>

				<div class="mt-3 grid space-y-3 text-sm">
					<a
						class="text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 unstyled"
						href="/terms-conditions">Terms &amp; Conditions</a
					>

					<a
						class="text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 unstyled"
						href="/privacy-policy">Privacy Policy</a
					>
				</div>
			</div>
		</div>

		<p class="text-xs sm:text-sm text-stone-600 dark:text-stone-500">
			© {new Date().getFullYear()}
			<a href="/" class="unstyled">{PUBLIC_APP_NAME}</a>
		</p>
	</div>
</footer>
