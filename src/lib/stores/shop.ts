import { writable } from 'svelte/store';
import type { Order } from './$types';

export const cartStore = writable<object>({});

export const order = writable<Order>({});
