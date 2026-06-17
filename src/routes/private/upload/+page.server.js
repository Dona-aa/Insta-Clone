import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import pool from '$lib/server/db.js';

export function load({ locals }) {
	// Nur eingeloggte Benutzer dürfen die Upload-Seite öffnen
	if (!locals.user) {
		redirect(303, '/login');
	}
}

export const actions = {
	upload: async ({ request, locals }) => {
		// Falls der Benutzer nicht eingeloggt ist, wird er zum Login geschickt
		if (!locals.user) {
			redirect(303, '/login');
		}

		// Formulardaten vom Upload-Formular lesen
		const formData = await request.formData();

		const description = String(formData.get('description') ?? '').trim();
		const image = formData.get('image');

		// Beschreibung prüfen
		if (description.length < 3 || description.length > 200) {
			return fail(400, {
				error: 'Description must have 3 to 200 characters.',
				description
			});
		}

		// Prüfen, ob eine Datei ausgewählt wurde
		if (!(image instanceof File) || image.size === 0) {
			return fail(400, {
				error: 'Please select an image.',
				description
			});
		}

		// Nur Bilddateien erlauben
		if (!image.type.startsWith('image/')) {
			return fail(400, {
				error: 'Only image files are allowed.',
				description
			});
		}

		// Eindeutiger Dateiname für Vercel Blob
		const filename = `${randomUUID()}-${image.name}`;

		// Bild in Vercel Blob hochladen
		const blob = await put(filename, image, {
			access: 'public',
			token: BLOB_READ_WRITE_TOKEN
		});

		// Bild-URL und Beschreibung in MySQL speichern
		await pool.execute('INSERT INTO images (image, description, author_id) VALUES (?, ?, ?)', [
			blob.url,
			description,
			locals.user.id
		]);

		// Nach dem Upload zum eigenen Profil weiterleiten
		redirect(303, `/profile/${locals.user.id}`);
	}
};