<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';

	import IconH4 from '~icons/tabler/h-4';
	import IconH5 from '~icons/tabler/h-5';
	import IconPilcrow from '~icons/tabler/pilcrow';
	import IconList from '~icons/tabler/list';
	import IconBold from '~icons/tabler/bold';
	import IconLink from '~icons/tabler/link';
	import IconUnlink from '~icons/tabler/unlink';

	export let content: string = '';
	export let name: string = 'desc';
	let element: any;
	let editor: any;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				Link.configure({
					protocols: ['http', 'mailto'],
					validate: (href) => /^https?:\/\//.test(href),
					openOnClick: true
				})
			],
			content: content,
			editorProps: {
				attributes: {
					class:
						'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none h-full px-3 pb-2 min-h-[200px] w-full'
				}
			},
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			},
			onUpdate({ editor }) {
				content = editor.getHTML();
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	function setLink() {
		const previousUrl = editor.getAttributes('link').href;
		const url = window.prompt('URL', previousUrl);

		// cancelled
		if (url === null) {
			return;
		}

		// empty
		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();

			return;
		}

		// update link
		editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	}
</script>

<div class="bg-primary-100 dark:bg-surface-700 text-primary-800 dark:text-surface-200 rounded-md">
	<input type="hidden" {name} value={content} />

	<div
		class="flex items-center bg-primary-200 dark:bg-surface-800 text-primary-800 dark:text-surface-200 rounded-t-md p-1 gap-1"
	>
		{#if editor}
			<button
				type="button"
				on:click={() => editor.chain().focus().setParagraph().run()}
				class="p-1 hover:bg-surface-500 rounded"
			>
				<IconPilcrow class="w-5 h-5" />
			</button>

			<button
				type="button"
				on:click={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
				class="p-1 hover:bg-surface-500 rounded"
			>
				<IconH4 />
			</button>

			<button
				type="button"
				on:click={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
				class="p-1 hover:bg-surface-500 rounded"
			>
				<IconH5 />
			</button>

			<button
				type="button"
				on:click={() => editor.chain().focus().toggleBold().run()}
				class="p-1 hover:bg-surface-500 rounded"
			>
				<IconBold />
			</button>

			<button
				type="button"
				on:click={() => editor.chain().focus().toggleBulletList().run()}
				class="p-1 hover:bg-surface-500 rounded"
			>
				<IconList />
			</button>
			<button type="button" on:click={() => setLink()} class="p-1 hover:bg-surface-500 rounded">
				<IconLink />
			</button>
			<button
				type="button"
				on:click={() => editor.chain().focus().unsetLink().run()}
				class="p-1 hover:bg-surface-500 rounded"
			>
				<IconUnlink />
			</button>
		{/if}
	</div>

	<div bind:this={element} />
</div>
