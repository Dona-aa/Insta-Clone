import { error } from '@sveltejs/kit';
import pool from '$lib/server/db.js';

export async function load({ params }) {
	// Profil-Benutzer anhand der URL-ID laden
	const [users] = await pool.execute('SELECT id, username FROM users WHERE id = ?', [params.id]);

	const profile = users[0];

	// Falls der Benutzer nicht existiert, wird eine 404-Seite angezeigt
	if (!profile) {
		error(404, 'User not found.');
	}

	// Alle Bilder dieses Benutzers laden
	const [images] = await pool.execute(
		`SELECT id, image, description, votes, created_at
		 FROM images
		 WHERE author_id = ?
		 ORDER BY created_at DESC`,
		[params.id]
	);

	// Profil und Bilder an die Svelte-Seite senden
	return {
		profile,
		images
	};
}