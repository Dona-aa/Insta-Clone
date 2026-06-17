import { fail, redirect } from '@sveltejs/kit';
import { hashPassword, createSession } from '$lib/server/auth.js';
import pool from '$lib/server/db.js';

export const actions = {
	register: async ({ request, cookies }) => {
		// Formulardaten aus der Register-Seite lesen
		const formData = await request.formData();

		const username = String(formData.get('username') ?? '').trim();
		const email = String(formData.get('email') ?? '').trim();
		const password = String(formData.get('password') ?? '');

		// Username prüfen
		if (username.length < 3) {
			return fail(400, {
				error: 'Username must be at least 3 characters long.',
				username,
				email
			});
		}

		// Email einfach prüfen
		if (!email.includes('@')) {
			return fail(400, {
				error: 'Please enter a valid email.',
				username,
				email
			});
		}

		// Passwortlänge prüfen
		if (password.length < 6) {
			return fail(400, {
				error: 'Password must be at least 6 characters long.',
				username,
				email
			});
		}

		// Prüfen, ob Username oder Email schon existiert
		const [existingUsers] = await pool.execute(
			'SELECT id FROM users WHERE username = ? OR email = ?',
			[username, email]
		);

		if (existingUsers.length > 0) {
			return fail(400, {
				error: 'Username or email is already taken!',
				username,
				email
			});
		}

		// Passwort wird vor dem Speichern verschlüsselt
		const passwordHash = await hashPassword(password);

		// Neuen Benutzer speichern
		const [result] = await pool.execute(
			'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
			[username, email, passwordHash]
		);

		// Nach der Registrierung direkt einloggen
		const sessionId = await createSession(result.insertId);

		// Session-ID als Cookie speichern
		cookies.set('session_id', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30
		});

		// Zur Startseite weiterleiten
		redirect(303, '/');
	}
};