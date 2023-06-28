import { db } from '$lib/server/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { PRODUCT_UNITS, ORDER_STATUSES, COUNTRIES } from '$lib/consts';
import { sendDataToSlack, sendEmail } from '$lib/server/utils';
import { orderSchema } from '$lib/zod';

export const load = async ({ params }) => {
	const id: number | undefined = params.id && params.id !== 'new' ? Number(params.id) : undefined;

	let order = id
		? await db.order.findUnique({
				where: {
					id: id
				},
				include: {
					items: {
						include: {
							product: {
								select: {
									id: true,
									name: true,
									unit: true,
									sku: true,
									min_qty: true,
									weight: true
								}
							}
						}
					}
				}
		  })
		: null;

	if (id && !order) throw error(404, 'Order not found.');

	if (order) {
		order.items = order?.items?.map(function (p: OrderItem) {
			p.name = p.product.name;
			p.unit = p.product.unit;
			p.min_qty = p.product.min_qty;
			p.weight = p.product.weight;
			return p;
		});
	}

	const form = await superValidate(JSON.parse(JSON.stringify(order)), orderSchema);

	const units = PRODUCT_UNITS;
	const statuses = ORDER_STATUSES;

	const users = await db.authUser.findMany({
		where: {
			active: true
		},
		select: {
			id: true,
			name: true,
			email: true,
			phone: true
		}
	});

	return { form, units, statuses, users, countries: COUNTRIES };
};

export const actions = {
	save: async (event) => {
		const formData = await event.request.formData();
		const form = await superValidate(formData, orderSchema);

		// console.log('error', JSON.stringify(form.errors));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (form.data.id) {
			await db.order.update({
				where: {
					id: form.data.id
				},
				data: {
					status: form.data.status,
					amount: form.data.amount,
					shipping_cost: form.data.shipping_cost,
					tax_cost: form.data.tax_cost,
					client_name: form.data.client_name,
					client_email: form.data.client_email,
					client_phone: form.data.client_phone,
					tracker_number: form.data.tracker_number,
					items: {
						deleteMany: {},
						create: form.data?.items.map((item) => {
							return {
								product_id: item.product_id,
								qty: item.qty,
								price: item.price
							};
						})
					}
				}
			});
		} else {
			await db.order.create({
				data: {
					status: form.data.status,
					number: form.data.number,
					amount: form.data.amount,
					shipping_cost: form.data.shipping_cost,
					tax_cost: form.data.tax_cost,
					client_name: form.data.client_name,
					client_email: form.data.client_email,
					client_phone: form.data.client_phone,
					client_country: form.data.client_country,
					client_address: form.data.client_address,
					user: {
						connect: { id: form.data.user_id }
					},
					items: {
						create: form.data.items.map((item) => ({
							price: item.price,
							qty: item.qty,
							product_id: item.product_id
						}))
					}
				}
			});
		}

		throw redirect(303, '/admin/orders');
	},

	delete: async ({ request }) => {
		const values = await request.formData();
		const form = await superValidate(values, orderSchema);

		try {
			await db.orderItems.deleteMany({
				where: {
					order_id: form.data.id
				}
			});

			await db.order.delete({
				where: {
					id: form.data.id
				}
			});
		} catch (e) {
			console.error(e);

			return fail(400, { e });
		}

		throw redirect(303, '/admin/orders');
	},

	sendEmail: async ({ request }) => {
		const values = await request.formData();

		const order = await db.order.findUnique({
			where: {
				id: Number(values.get('id'))
			},
			include: {
				items: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								unit: true,
								sku: true,
								min_qty: true
							}
						}
					}
				}
			}
		});

		sendEmail(order?.client_email, 'New order', 'new-order', order);

		throw redirect(303, '/admin/orders');
	},

	sendMessage: async ({ request }) => {
		const values = await request.formData();
		const form = await superValidate(values, orderSchema);
		const order = await db.order.findUnique({
			where: {
				id: form.data.id
			}
		});

		sendDataToSlack({
			title: 'New order 👋',
			text: `We got <https://ekome.eu/admin/orders/${order?.id}|a new order> 🤩`
		});
	}
};
