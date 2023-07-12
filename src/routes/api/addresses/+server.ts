import { actionResult, superValidate } from 'sveltekit-superforms/server';
import { json } from '@sveltejs/kit';
import { addressSchema } from '$lib/zod';

export const GET = async (event) => {
	const user = {}; //await locals.auth.validateUser();

	const addresses = [];
	// 	await db.address.findMany({
	// 	where: {
	// 		user_id: user?.id
	// 	},
	// 	orderBy: {
	// 		id: 'desc'
	// 	}
	// });
	return json(addresses);
};

export const POST = (async (event) => {
	const user = {}; //await locals.auth.validateUser();
	const form = await superValidate(event, addressSchema, {
		id: 'addressesForm'
	});
	form.data.id = Number.isInteger(form.data.id) ? form.data.id : null;

	if (!form.valid) return actionResult('failure', { form });

	if (!form.data.id) {
		// await db.address.create({
		// 	data: {
		// 		country: form.data.country,
		// 		city: form.data.city,
		// 		street: form.data.street,
		// 		zip: form.data.zip,
		// 		etc: form.data.etc,
		// 		user: {
		// 			connect: { id: user?.id }
		// 		}
		// 	}
		// });
	} else {
		// await db.address.update({
		// 	where: {
		// 		id: form.data.id
		// 	},
		// 	data: {
		// 		country: form.data.country,
		// 		city: form.data.city,
		// 		street: form.data.street,
		// 		etc: form.data.etc,
		// 		zip: form.data.zip
		// 	}
		// });
	}

	return actionResult('success', { form });
}) satisfies RequestHandler;

export const DELETE = (async ({ request }) => {
	const data = await request.json();

	try {
		// await db.address.delete({
		// 	where: {
		// 		id: data.id
		// 	}
		// });
		return json({ success: true });
	} catch (e) {
		console.error(e);

		return json({ success: false });
	}
}) satisfies RequestHandler;
