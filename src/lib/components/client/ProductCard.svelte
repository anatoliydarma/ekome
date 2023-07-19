<script lang="ts">
	export let product: Product;
	export let categorySlug: string;
</script>

<a
	class="space-y-2 unstyled group overflow-hidden rounded-lg"
	href="/{categorySlug}/{product.slug}"
	title={product.name}
>
	<div class="w-full h-64 overflow-hidden">
		<img
			src={product.images && product.images.length > 0
				? `/assets/${product.images[0]}`
				: '/img/noimage.svg'}
			class="bg-stone/50 w-full h-full object-cover group-hover:brightness-95"
			alt={product.name}
		/>
	</div>

	<footer class="flex justify-between items-start gap-4">
		<div class="capitalize line-clamp-2">{product.name}</div>
		<div class="font-medium w-14 whitespace-nowrap text-right">€ {product.price}</div>
	</footer>
</a>
