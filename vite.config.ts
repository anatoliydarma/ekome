import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import Icons from 'unplugin-icons/vite';
import autoImport from 'sveltekit-autoimport';

export default defineConfig({
	plugins: [
		autoImport({
			components: ['./src/lib/components']
		}),
		sveltekit(),
		Icons({
			compiler: 'svelte'
		})
	]
});
