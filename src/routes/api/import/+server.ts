import { json } from '@sveltejs/kit';
import { db, getSlug } from '$lib/server/prisma';
import slugify from 'slugify';
import { getName } from '$lib/server/utils';

export const POST = async ({ request }) => {
	const csvData: any[] = await request.json();

	csvData.forEach(async (row) => {
		const product = await db.product.findFirst({
			where: { name: getName(row.name, row.name_2) }
		});

		if (!product) {
			const slug = await getSlug(getName(row.name, row.name_2), 'product');

			await db.product.create({
				data: {
					name: getName(row.name, row.name_2),
					slug: slug,
					sub_name: row.sub_name ? row.sub_name : '',
					status: row.status,
					desc: `${row.desc ? row.desc : ''}<br /><br />${checkData(row.ingredients, 'Ingredients')}
				${checkData(row.usage, 'Usage')}
				${checkData(row.storage, 'Storage')}
				${checkData(row.container_type, 'Container Type')}`,
					unit: row.unit,
					gst: row.gst,
					price: row.price,
					container_price: row.container_price,
					min_qty: row.min_qty,
					category: {
						connect: {
							id: row.category
						}
					},
					weight: row.weight,
					container_weight: row.container_weight,
					brand: row.brand,
					properties: row.filters
						? {
								create: row.filters
									.replace(/\"/g, '')
									.split(', ')
									.map((f: string) => {
										return {
											property: {
												connectOrCreate: {
													where: {
														name: f
													},
													create: {
														name: f
													}
												}
											}
										};
									})
						  }
						: {}
				}
			});
		}
	});

	return json({ success: true });
};

function checkData(data: string | null, name: string) {
	return data ? `<strong>${name}:</strong> ${data}<br /><br />` : '';
}
