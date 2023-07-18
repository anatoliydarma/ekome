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

export const categorySchema = z.object({
	id: z.number().nullable(),
	name: z.string(),
	slug: z.string(),
	desc: z.string().optional().default(''),
	sort: z.number().optional().default(1),
	status: z.boolean(),
	image: z.string().optional()
});

export const orderItems = z.object({
	id: z.number().optional(),
	qty: z.number(),
	price: z.coerce.number().multipleOf(0.01),
	product_id: z.number(),
	name: z.string().optional(),
	unit: z.string().optional(),
	min_qty: z.number().optional(),
	weight: z.number().optional()
});

export const orderSchema = z.object({
	id: z.number().nullable(),
	number: z.string(),
	status: z.string().default('processing'),
	amount: z.coerce.number().multipleOf(0.01),
	shipping_cost: z.coerce.number().multipleOf(0.01),
	tax_cost: z.coerce.number().multipleOf(0.01),
	tracker_number: z.string().nullable().optional(),
	client_name: z.string(),
	client_email: z.string(),
	client_phone: z.string().nullable().optional(),
	client_country: z.string(),
	client_address: z.string(),
	user_id: z.string(),
	items: z.array(orderItems).min(1),
	weight: z.number().optional(),
	created_at: z.string().optional()
});

export const productSchema = z.object({
	id: z.number().nullable(),
	name: z.string(),
	slug: z.string().optional(),
	desc: z.string().optional().default('').nullable(),
	sku: z.string().optional().default('').nullable(),
	upc: z.coerce.number().optional().default(0).nullable(),
	unit: z.string().default('piece'),
	price: z.coerce.number().multipleOf(0.01).optional().default(0),
	gst: z.number().default(1),
	min_qty: z.coerce.number().optional().default(1),
	status: z.string().default('draft'),
	category_id: z.number(),
	images: z.string().array().optional().nullable(),
	properties: z
		.object({
			id: z.number().int().min(1),
			name: z.string().min(2)
		})
		.array()
		.optional()
		.nullable(),
	brand: z.string().optional().nullable(),
	country: z.string().optional().nullable(),
	weight: z.coerce.number().optional().default(0).nullable()
});

export const propertySchema = z.object({
	id: z.number().nullable(),
	name: z.string()
});
