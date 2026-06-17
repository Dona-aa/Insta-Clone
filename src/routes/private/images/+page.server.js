import { del } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';
import pool from '$lib/server/db.js';

export async function load({ locals }) {
	// Nur eingeloggte Benutzer dürfen ihre Bilder verwalten
	if (!locals.user) {
		redirect(303, '/login');
	}

	// Alle Bilder vom eingeloggten Benutzer laden
	const [images] = await pool.execute(
		`SELECT id, image, description, votes, created_at
		 FROM images
		 WHERE author_id = ?
		 ORDER BY created_at DESC`,
		[locals.user.id]
	);

	return {
		images
	};
}

export const actions = {
	delete: async ({ request, locals }) => {
		// Ohne Login darf nichts gelöscht werden
		if (!locals.user) {
			redirect(303, '/login');
		}

		// ID vom Bild aus dem Formular lesen
		const formData = await request.formData();
		const imageId = formData.get('imageId');

		// Prüfen, ob das Bild wirklich dem eingeloggten Benutzer gehört
		const [images] = await pool.execute(
			'SELECT image FROM images WHERE id = ? AND author_id = ?',
			[imageId, locals.user.id]
		);

		const image = images[0];

		// Wenn kein Bild gefunden wurde, ist Löschen nicht erlaubt
		if (!image) {
			return fail(404, {
				error: 'Picture not found or deletion not allowed.'
			});
		}

		// Bild aus Vercel Blob löschen
		await del(image.image, {
			token: BLOB_READ_WRITE_TOKEN
		});

		// Bild aus der Datenbank löschen
		await pool.execute('DELETE FROM images WHERE id = ? AND author_id = ?', [
			imageId,
			locals.user.id
		]);

		return {
			deleted: true
		};
	}
};