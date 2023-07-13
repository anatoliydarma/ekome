import { json } from '@sveltejs/kit';
import { getName, save } from '$lib/server/utils';

export const POST = async ({ request, locals }) => {
	const csvData: any[] = await request.json();
	locals.pb.autoCancellation(false);
	csvData.forEach(async (row, i) => {
		const records = await locals.pb.collection('products').getList(1, 1, {
			filter: `name="${getName(row.name, row.name_2)}"`
		});

		if (records.items.length === 0) {
			let data = {
				name: getName(row.name, row.name_2),
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
				category: row.category,
				weight: row.weight,
				container_weight: row.container_weight,
				brand: row.brand,
				properties: row.filters ? row.filters.replace(/\"/g, '').split(', ') : null // [1, 2]
			};

			const product = await save('products', data);

			let category = await locals.pb.collection('categories').getOne(data.category);
			category.products = [...category.products, product.id];
			console.log('category.products', category.products);

			await save('categories', category);
		}
	});

	// locals.pb.autoCancellation(true);
	return json({ success: true });
};

function checkData(data: string | null, name: string) {
	return data ? `<strong>${name}:</strong> ${data}<br /><br />` : '';
}
