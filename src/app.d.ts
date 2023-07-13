// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			pb: import('pocketbase').default;
			user: import('pocketbase').default['authStore']['model'];
			formData: Record<string, any>;
		}
		interface Error {
			code?: string;
		}

		// interface PageData {}
		// interface Platform {}
	}

	interface Cart {
		id: string;
		user_id: string;
		items: CartItem;
	}

	interface CartItem {
		product_id: number;
		name: string;
		price: number;
		qty: number;
		min_qty: number;
		image: string;
		weight: number?;
	}

	interface Address {
		id: number;
		country: string;
		city: string;
		street: string;
		etc: string;
		zip: string;
		user_id: number;
	}

	interface Order {
		id: number?;
		number: string?;
		status: string;
		amount: number;
		weight: number?;
		shipping_cost: number;
		tax_cost: number;
		client_name: string;
		client_email: string;
		client_phone: string?;
		client_country: string;
		client_address: String;
		user_id: number;
	}

	interface OrderItem {
		id: number?;
		qty: number;
		price: number;
		order_id: number?;
		product_id: number?;
		name: string?;
		unit: number?;
		min_qty: number?;
		weight: number?;
	}

	interface Product {
		id: number?;
		name: string;
		slug: string;
		brand: string?;
		country: string?;
		desc: string?;
		unit: string;
		weight: number?;
		sku: string?;
		upc: number?;
		min_qty: number?;
		status: string;
		images: string[]?;
		popularity: number?;
		price: number;
		gst: number?;
		category_id: number?;
		created_at: string?;
		updated_at: string?;
		expand: any;
	}

	interface Category {
		id: string?;
		name: string;
		desc: string;
		sort: number;
		status: boolean;
		images: string;
	}
}

export {};
