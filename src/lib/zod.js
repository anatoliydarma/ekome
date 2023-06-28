import { z } from 'zod';
// See https://zod.dev/?id=primitives for schema syntax

export const addressSchema = z.object({
	id: z.number().optional().nullable(),
	country: z.string().default('FR'),
	city: z.string().min(1, { message: 'Required' }),
	street: z.string().min(1, { message: 'Required' }),
	zip: z.string().trim().min(1, { message: 'Required' }),
	etc: z.string().default('').nullable()
});

export const userSchema = z.object({
	id: z.string().optional(),
	name: z.string().nullable(),
	email: z.string(),
	phone: z.string().nullable(),
	role: z.string().default('client'),
	active: z.boolean(),
	password: z.string().optional(),
	email_verified: z.boolean()
});
