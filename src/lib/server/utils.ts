import { auth } from '$lib/server/lucia';
import { idToken } from '@lucia-auth/tokens';
import { render } from 'svelte-email';
import VerifyEmail from '$lib/emails/VerifyEmail.svelte';
import NewOrder from '$lib/emails/NewOrder.svelte';
import ResetPassword from '$lib/emails/ResetPassword.svelte';
import nodemailer from 'nodemailer';
import { PUBLIC_APP_NAME, PUBLIC_EMAIL } from '$env/static/public';
import { EURO, GST, MARGIN } from '$lib/consts';
import { IncomingWebhook } from '@slack/webhook';
import { env } from '$env/dynamic/private';
const url = env.PRIVATE_SLACK_WEBHOOK_URL_STORE;

export const otpToken = idToken(auth, 'otp', {
	expiresIn: 60 * 60 // 1 hour
});

export const emailVerificationToken = idToken(auth, 'email-verification', {
	expiresIn: 60 * 60 // 1 hour
});

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
