import { del } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';
import pool from '$lib/server/db.js';

export async function load({ locals }) {
	// Nur eingeloggte Benutzer dürfen weiter
	if (!locals.user) {
		redirect(303, '/login');
	}

	// Nur Admins dürfen den Admin-Bereich öffnen
	if (locals.user.role !== 'admin') {
		redirect(303, '/');
	}

	// Alle Benutzer für die Benutzerverwaltung laden
	const [users] = await pool.execute(
		`SELECT id, username, email, role, is_banned, created_at
		 FROM users
		 ORDER BY created_at DESC`
	);

	// Alle Posts für die Postverwaltung laden
	const [images] = await pool.execute(
		`SELECT i.id, i.image, i.description, i.votes, i.created_at, u.username
		 FROM images i
		 JOIN users u ON u.id = i.author_id
		 ORDER BY i.created_at DESC`
	);

	// Daten und Statistik an die Admin-Seite senden
	return {
		users,
		images,
		stats: {
			userCount: users.length,
			imageCount: images.length
		}
	};
}

export const actions = {
	banUser: async ({ request, locals }) => {
		// Nur Admins dürfen Benutzer bannen
		if (!locals.user || locals.user.role !== 'admin') {
			redirect(303, '/');
		}

		const formData = await request.formData();
		const userId = Number(formData.get('userId'));

		// Admin darf sich nicht selbst bannen
		if (userId === locals.user.id) {
			return fail(400, {
				error: 'You cannot ban yourself.'
			});
		}

		// Nur normale Benutzer können gebannt werden
		await pool.execute('UPDATE users SET is_banned = 1 WHERE id = ? AND role != "admin"', [userId]);

		return {
			success: 'User was banned.'
		};
	},

	unbanUser: async ({ request, locals }) => {
		// Nur Admins dürfen Benutzer entbannen
		if (!locals.user || locals.user.role !== 'admin') {
			redirect(303, '/');
		}

		const formData = await request.formData();
		const userId = Number(formData.get('userId'));

		// Benutzer wieder aktivieren
		await pool.execute('UPDATE users SET is_banned = 0 WHERE id = ?', [userId]);

		return {
			success: 'User was unbanned.'
		};
	},

	deleteUser: async ({ request, locals }) => {
		// Nur Admins dürfen Benutzer löschen
		if (!locals.user || locals.user.role !== 'admin') {
			redirect(303, '/');
		}

		const formData = await request.formData();
		const userId = Number(formData.get('userId'));

		// Admin darf sich nicht selbst löschen
		if (userId === locals.user.id) {
			return fail(400, {
				error: 'You cannot delete yourself.'
			});
		}

		// Prüfen, ob es ein normaler Benutzer ist
		const [users] = await pool.execute('SELECT id FROM users WHERE id = ? AND role != "admin"', [
			userId
		]);

		if (users.length === 0) {
			return fail(404, {
				error: 'User was not found or cannot be deleted.'
			});
		}

		// Alle Bilder dieses Benutzers laden
		const [userImages] = await pool.execute('SELECT id, image FROM images WHERE author_id = ?', [
			userId
		]);

		// Bilder aus Vercel Blob löschen
		for (const image of userImages) {
			await del(image.image, {
				token: BLOB_READ_WRITE_TOKEN
			});
		}

		// Kommentare vom Benutzer und Kommentare unter seinen Bildern löschen
		await pool.execute(
			`DELETE FROM comments
			 WHERE user_id = ?
			 OR image_id IN (SELECT id FROM images WHERE author_id = ?)`,
			[userId, userId]
		);

		// Votes vom Benutzer und Votes auf seinen Bildern löschen
		await pool.execute(
			`DELETE FROM votes
			 WHERE user_id = ?
			 OR image_id IN (SELECT id FROM images WHERE author_id = ?)`,
			[userId, userId]
		);

		// Bilder, Sessions und Benutzer aus der Datenbank löschen
		await pool.execute('DELETE FROM images WHERE author_id = ?', [userId]);
		await pool.execute('DELETE FROM sessions WHERE user_id = ?', [userId]);
		await pool.execute('DELETE FROM users WHERE id = ?', [userId]);

		return {
			success: 'User was fully deleted.'
		};
	},

	deleteImage: async ({ request, locals }) => {
		// Nur Admins dürfen jeden Post löschen
		if (!locals.user || locals.user.role !== 'admin') {
			redirect(303, '/');
		}

		const formData = await request.formData();
		const imageId = Number(formData.get('imageId'));

		// Bild-URL laden, damit es auch aus Blob gelöscht werden kann
		const [images] = await pool.execute('SELECT image FROM images WHERE id = ?', [imageId]);
		const image = images[0];

		if (!image) {
			return fail(404, {
				error: 'Image was not found.'
			});
		}

		// Bild aus Vercel Blob löschen
		await del(image.image, {
			token: BLOB_READ_WRITE_TOKEN
		});

		// Zugehörige Kommentare und Votes löschen
		await pool.execute('DELETE FROM comments WHERE image_id = ?', [imageId]);
		await pool.execute('DELETE FROM votes WHERE image_id = ?', [imageId]);

		// Post aus der Datenbank löschen
		await pool.execute('DELETE FROM images WHERE id = ?', [imageId]);

		return {
			success: 'Post was deleted.'
		};
	}
};