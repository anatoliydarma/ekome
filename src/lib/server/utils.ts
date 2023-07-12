import { render } from 'svelte-email';
import VerifyEmail from '$lib/emails/VerifyEmail.svelte';
import NewOrder from '$lib/emails/NewOrder.svelte';
import ResetPassword from '$lib/emails/ResetPassword.svelte';
import nodemailer from 'nodemailer';
import { PUBLIC_APP_NAME, PUBLIC_EMAIL } from '$env/static/public';
import { EURO, GST, MARGIN } from '$lib/consts';
import { IncomingWebhook } from '@slack/webhook';
import { env } from '$env/dynamic/private';
import { pb } from './pocketbase';
import slugify from 'slugify';
const url = env.PRIVATE_SLACK_WEBHOOK_URL_STORE;

export async function save(collection: string, record: any, create = false) {
	// convert obj to FormData in case one of the fields is instanceof FileList
	const data = object2formdata(record);
	if (record.id && !create) {
		// "create" flag overrides update
		return await pb.collection(collection).update(record.id, data);
	} else {
		return await pb.collection(collection).create(data);
	}
}
// convert obj to FormData in case one of the fields is instanceof FileList
function object2formdata(obj: {}) {
	// check if any field's value is an instanceof FileList
	if (!Object.values(obj).some((val) => val instanceof FileList || val instanceof File)) {
		// if not, just return the original object
		return obj;
	}
	// otherwise, build FormData from obj
	const fd = new FormData();
	for (const [key, val] of Object.entries(obj)) {
		if (val instanceof FileList) {
			for (const file of val) {
				fd.append(key, file);
			}
		} else if (val instanceof File) {
			// handle File before "object" so that it doesn't get serialized as JSON
			fd.append(key, val);
		} else if (typeof val === 'object') {
			fd.append(key, JSON.stringify(val));
		} else {
			fd.append(key, val as any);
		}
	}
	return fd;
}

export async function getUniqueSlug(slug: string, collection: string, count = 0) {
	slug = slugify(slug, {
		lower: true,
		strict: true,
		remove: /[*+~.()'"!:@]/g
	});
	const records = await pb.collection(collection).getList(1, 1, {
		filter: `slug="${slug}"`
	});

	if (records.items.length != 0) {
		count += 1;
		slug = `${slug}-${count}`;
		getUniqueSlug(slug, collection, count);
	} else {
		return slug;
	}
}

export async function sendEmail(email: string, subject: string, template: string, prop: any) {
	const transporter = nodemailer.createTransport({
		host: '127.0.0.1',
		port: 1025,
		secure: false
	});

	let emailHtml;
	if (template == 'verify-email') {
		emailHtml = render({
			template: VerifyEmail,
			props: {
				link: prop
			}
		});
	}

	if (template == 'reset-password') {
		emailHtml = render({
			template: ResetPassword,
			props: {
				link: prop
			}
		});
	}

	if (template == 'new-order') {
		emailHtml = render({
			template: NewOrder,
			props: {
				order: prop
			}
		});
	}

	const options = {
		from: PUBLIC_EMAIL,
		to: email,
		subject: `${subject} - ${PUBLIC_APP_NAME}`,
		html: emailHtml
	};

	await transporter.sendMail(options);
}

export function getOrderByProduct(value: string | null) {
	if (value == '-created_at') {
		return { key: 'created_at', sort: 'desc' };
	}
	if (value == '-price') {
		return { key: 'price', sort: 'desc' };
	}
	if (value == 'price') {
		return { key: 'price', sort: 'asc' };
	}
	if (value == '-name') {
		return { key: 'name', sort: 'desc' };
	}
	if (value == 'name') {
		return { key: 'name', sort: 'asc' };
	}
	if (value == '-popularity') {
		return { key: 'popularity', sort: 'desc' };
	}
	return { key: 'created_at', sort: 'desc' };
}

export function getCostOfProduct(product: Product) {
	var gst = GST.find(function (i) {
		return Number(i.key) == Number(product.gst);
	});

	var gstCost = (Number(product.price) * Number(gst.value)) / 100;

	var cost = Number(product.price) + Number(gstCost);

	var marginCost = (Number(cost) * Number(MARGIN)) / 100;

	cost = Number(cost) + Number(marginCost); // rupee

	var costEuro = cost / EURO; // TODO get dynamic €

	return Number(costEuro.toFixed(1));
}

export function sendLogToSlack(error: Error | string): void {
	const webhook = new IncomingWebhook(url, {
		icon_emoji: ':face_with_spiral_eyes:'
	});

	(async () => {
		await webhook.send({
			text: error?.message,
			attachments: [
				{
					author_name: 'Central ticketing',
					color: 'danger',
					title: 'Trace',
					text: error?.stack
				}
			]
		});
	})();
}

export function sendDataToSlack(data: any): void {
	const webhook = new IncomingWebhook(url, {
		icon_emoji: '💚'
	});

	(async () => {
		await webhook.send({
			text: data.title,
			blocks: [
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: data.text
					}
				}
			]
		});
	})();
}

export function getName(name: string, name2: string | undefined) {
	let extra_name = name2 != undefined ? ` ${name2?.trim()}` : '';
	return `${name?.trim()}${extra_name}`;
}

export const serializeNonPOJOs = (obj: object) => {
	return JSON.parse(JSON.stringify(obj));
};
