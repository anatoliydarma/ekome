import { json } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import sharp from 'sharp';
import { unlink } from 'node:fs/promises';
const assets = './static/assets/';

// TODO validate size

export const POST = async ({ request }) => {
	const data = await request.formData();
	const images = data.getAll('images');
	const name = data.get('name');
	let filenames: string[] = [];

	await Promise.all(
		images.map(async (file, i) => {
			let filename = `${name}-${nanoid()}.webp`;
			filenames.push(filename);

			if (file) {
				let ab = await file.arrayBuffer();

				await sharp(ab)
					.resize(800, 800)
					.webp({ lossless: true })
					.toFile(`${assets}${filename}`)
					.catch((err) => {
						return json(err);
					});
			}
		})
	);

	return json(filenames);
};

export const DELETE = async ({ request }) => {
	const data = await request.json();
	const path = `${assets}${data.filename}`;

	unlink(path)
		.then()
		.catch((err) => {
			console.error('remove image', err);
		});

	return json({ success: true });
};
