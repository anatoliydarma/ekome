import { json } from '@sveltejs/kit';
import { db } from '$lib/server/prisma';
import { nanoid } from 'nanoid';
import { sendDataToSlack, sendEmail } from '$lib/server/utils';

// CREATE
export const POST = async ({ request, locals }) => {
	const { order } = await request.json();
	const { user } = await locals.auth.validateUser();

	//TODO  number: string?;
	order.number = nanoid();

	const newOrder = await db.order.create({
		data: {
			status: order.status,
			number: order.number,
			amount: order.amount,
			shipping_cost: order.shipping_cost,
			tax_cost: order.tax_cost,
			client_name: order.client_name,
			client_email: order.client_email,
			client_phone: order.client_phone,
			client_country: order.client_country,
			client_address: order.client_address,
			user: {
				connect: { id: user?.id }
			},
			items: {
				create: order.items.map((item: OrderItem) => ({
					price: item.price,
					qty: item.qty,
					product_id: item.product_id
				}))
			}
		},
		include: {
			items: {
				include: {
					product: {
						select: {
							name: true,
							images: true
						}
					}
				}
			}
		}
	});
	if (newOrder) {
		sendEmail(newOrder?.client_email, 'New order', 'new-order', newOrder);
		sendDataToSlack({
			title: 'New order 👋',
			text: `We got <https://ekome.eu/admin/orders/${newOrder?.id}|a new order> 🤩`
		});
		return json({ orderId: newOrder.id });
	}
	return json({ orderId: null });
};
