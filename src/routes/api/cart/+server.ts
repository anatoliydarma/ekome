import { json } from '@sveltejs/kit';

import { nanoid } from 'nanoid';
import { getCostOfProduct } from '$lib/server/utils';

export const GET = async (event) => {
	const cartId = event.cookies.get('cart_id');
	const user = {}; //await locals.auth.validateUser();

	let cart = {};
	//cartId
	// ? await db.cart.findUnique({
	// 		where: {
	// 			id: cartId
	// 		},
	// 		include: {
	// 			items: {
	// 				include: {
	// 					product: true
	// 				}
	// 			}
	// 		}
	//   })
	// : null;

	if (user && cart && cart.user_id != user.id) {
		let oldCart = cart;
		cart = {};
		// 	await db.cart.findFirst({
		// 	where: {
		// 		user_id: user.id
		// 	},
		// 	include: {
		// 		items: {
		// 			include: {
		// 				product: true
		// 			}
		// 		}
		// 	}
		// });

		// if (oldCart) {
		// 	oldCart = await prisma.cart.findUnique({
		// 		where: {
		// 			id: oldCart.id
		// 		}
		// 	});

		// 	await prisma.cart.delete({
		// 		where: {
		// 			id: oldCart.id
		// 		}
		// 	});
		// }
	}

	event.cookies.delete('cart_id');

	if (cart && cart.user_id && !user) {
		cart = null;
	}

	if (!cart) {
		// cart = await db.cart.create({
		// 	data: {
		// 		id: nanoid()
		// 	},
		// 	include: {
		// 		items: {
		// 			include: {
		// 				product: true
		// 			}
		// 		}
		// 	}
		// });
	}

	event.cookies.set('cart_id', cart.id, { path: '/' });

	// Add user id
	// if (user && cart.user_id == null) {
	// 	await db.cart.update({
	// 		where: {
	// 			id: cart.id
	// 		},
	// 		data: {
	// 			user_id: user.id
	// 		},
	// 		include: {
	// 			items: {
	// 				include: {
	// 					product: true
	// 				}
	// 			}
	// 		}
	// 	});
	// }

	// Map items
	if (cart?.items?.length) {
		cart.items = cart.items.map((item) => ({
			product_id: item.product.id,
			name: item.product.name,
			price: getCostOfProduct(item.product),
			image: item.product.images?.length ? item.product.images[0] : null,
			qty: item.qty,
			min_qty: item.product.min_qty,
			weight: item.weight
		}));
	}

	return json(cart);
};

export const POST = async ({ request }) => {
	const { cart } = await request.json();
	if (cart) {
		// await db.cart.update({
		// 	where: {
		// 		id: cart.id
		// 	},
		// 	data: {
		// 		items: {
		// 			deleteMany: {},
		// 			create: cart.items.map((item: { product_id: any; qty: any }) => ({
		// 				product_id: item.product_id,
		// 				qty: item.qty,
		// 				weight: item.weight
		// 			}))
		// 		}
		// 	}
		// });
		return json(202);
	}

	return json(406);
};
