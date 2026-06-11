import { del } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';
import pool from '$lib/server/db.js';

export async function load({ locals }) {
	if (!locals.user) {
		redirect(303, '/login');
	}

	const [images] = await pool.execute(
		`SELECT id, image, description, votes, created_at
		 FROM images
		 WHERE author_id = ?
		 ORDER BY created_at DESC`,
		[locals.user.id]
	);

	return { images };
}

export const actions = {
	delete: async ({ request, locals }) => {
		if (!locals.user) {
			redirect(303, '/login');
		}

		const formData = await request.formData();
		const imageId = formData.get('imageId');

		const [images] = await pool.execute(
			'SELECT image FROM images WHERE id = ? AND author_id = ?',
			[imageId, locals.user.id]
		);

		const image = images[0];

		if (!image) {
			return fail(404, { error: 'Picture not found or deletion not allowed.' });
		}

		await del(image.image, { token: BLOB_READ_WRITE_TOKEN });

		await pool.execute('DELETE FROM images WHERE id = ? AND author_id = ?', [
			imageId,
			locals.user.id
		]);

		return { deleted: true };
	}
};