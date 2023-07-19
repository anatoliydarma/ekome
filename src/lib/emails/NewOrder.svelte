<script lang="ts">
	import { Column, Container, Hr, Html, Img, Link, Section, Text } from 'svelte-email';
	import { PUBLIC_APP_NAME, PUBLIC_DOMAIN, PUBLIC_EMAIL } from '$env/static/public';

	export let order: string;

	const fontFamily = '"Helvetica Neue",Helvetica,Arial,sans-serif';
	const logo = {
		margin: '0 auto',
		marginBottom: '32px'
	};

	const price = {
		fontFamily,
		fontWeight: '600',
		padding: '0px 30px 0px 0px',
		textAlign: 'right' as const
	};

	const left = {
		fontFamily,
		textAlign: 'left' as const
	};
</script>

<Html lang="en">
	<Container>
		<Img
			src={`${PUBLIC_DOMAIN}/img/ekome-logo.svg`}
			width="85"
			height="36"
			alt={PUBLIC_APP_NAME}
			style={logo}
		/>

		<Text>We’re happy to let you know that we’ve received your order.</Text>
		<Text>
			Once your package ships, we will send you an email with a tracking number and link so you can
			see the movement of your package.
		</Text>

		<Hr />
		{#each order.items as item}
			<table>
				<tbody>
					<tr>
						<td>
							<Text style={left}>
								<span dir="auto">{item.product.name}</span>
								<br />
								<span>Qty: {item.qty} </span>
							</Text>
						</td>
						<td>
							<Text style={price}>€ {item.price}</Text>
						</td>
					</tr>
				</tbody>
			</table>
		{/each}
		<Hr />

		<table>
			<tbody>
				<tr>
					<td>
						<Text style={left}>Total:</Text>
					</td>
					<td>
						<Text style={price}>€ {order.amount}</Text>
					</td>
				</tr>
			</tbody>
		</table>

		<Text>
			If you have any questions, contact us here or call us on {PUBLIC_EMAIL}!
		</Text>

		<Hr />
		<Link href={PUBLIC_DOMAIN}>{PUBLIC_APP_NAME}</Link>
	</Container>
</Html>
