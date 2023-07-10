import { db } from '$lib/server/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { ROLES } from '$lib/consts';
import { superValidate, setError } from 'sveltekit-superforms/server';
import { auth } from '$lib/server/lucia';
import { userSchema } from '$lib/zod';
import { Prisma } from '@prisma/client';
import { LuciaError } from 'lucia-auth';

const fullUserSchema = userSchema.pick({
	id: true,
	name: true,
	email: true,
	phone: true,
	role: true,
	active: true,
	password: true
});

export const load = async ({ params }) => {
	const id: string | undefined = params.id && params.id !== 'new' ? params.id : undefined;

	const user = id
		? await db.authUser.findUnique({
				where: {
					id: id
				}
		  })
		: null;

	if (id && !user) throw error(404, 'User not found.');

	const form = await superValidate(JSON.parse(JSON.stringify(user)), fullUserSchema);
	let roles = ROLES;
	return { form, roles };
};

export const actions = {
	save: async (event) => {
		const form = await superValidate(event, fullUserSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			if (form.data.id) {
				await db.authUser.update({
					where: {
						id: form.data.id
					},
					data: {
						name: form.data.name,
						email: form.data.email,
						phone: form.data.phone,
						role: form.data.role,
						active: form.data.active
					}
				});
			} else {
				try {
					const user = await auth.createUser({
						primaryKey: {
							providerId: 'email',
							providerUserId: form.data.email,
							password: form.data.password
						},
						attributes: {
							name: form.data.name,
							email: form.data.email,
							role: 'client',
							verified: true,
							phone: form.data.phone,
							active: form.data.active
						}
					});
				} catch (err) {
					if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
						if (err.message?.includes('email')) {
							return setError(form, 'email', 'A user with this email already exists.');
						}

						if (err.message?.includes('phone')) {
							return setError(form, 'phone', 'A user with this phone number already exists.');
						}
					}

					if (err instanceof LuciaError && err.message === 'AUTH_DUPLICATE_KEY_ID') {
						return setError(form, 'email', 'A user with this email already exists.');
					}
					return fail(500, {
						error: 'Unknown error occurred'
					});
				}

				return { form };
			}
		} catch (e) {
			return fail(400, { e });
		}

		throw redirect(303, '/admin/users');
	},

	delete: async ({ request }) => {
		const values = await request.formData();
		const form = await superValidate(values, userSchema);
		try {
			await db.authUser.delete({
				where: {
					id: form.data.id
				}
			});
		} catch (e) {
			console.error(e);
			return fail(400, { e });
		}

		throw redirect(303, '/admin/users');
	}
};
