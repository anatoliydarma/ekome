import { writable } from 'svelte/store';

export const cartStore = writable<object>({});
export const order = writable<Order>({});
