<script lang="ts">
	import { PUBLIC_APP_NAME } from '$env/static/public';
	export let data;
</script>

<svelte:head>
	<title>{PUBLIC_APP_NAME} - eco store</title>
</svelte:head>

<main class="px-4 max-w-screen-xl mx-auto">
	<div class="grid gap-6 grid-cols-4">
		{#each data.categories as category}
			<a class="card card-hover overflow-hidden" href="/{category.slug}">
				<header>
					<img
						src={category.image?.length > 0 ? `/assets/${category.image}` : '/img/noimage.svg'}
						class="bg-black/50 w-full aspect-[21/9] object-cover"
						alt="Post"
					/>
				</header>
				<div class="p-4 space-y-4">
					<h3>{category.name}</h3>
					<article>
						<p>
							{category.desc || ''}
						</p>
					</article>
				</div>
			</a>
		{/each}
	</div>
</main>
