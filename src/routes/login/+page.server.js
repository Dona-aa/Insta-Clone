import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import pool from '$lib/server/db.js';
import { createSession, verifyPassword } from '$lib/server/auth.js';

export const actions = {
	login: async ({ request, cookies }) => {
		// Login-Daten aus dem Formular lesen
		const formData = await request.formData();

		const username = String(formData.get('username') ?? '').trim();
		const password = String(formData.get('password') ?? '');

		// Prüfen, ob beide Felder ausgefüllt sind
		if (!username || !password) {
			return fail(400, {
				error: 'Please fill out all fields.',
				username
			});
		}

		// Benutzer aus der Datenbank laden
		const [users] = await pool.execute(
			'SELECT id, username, password_hash, is_banned FROM users WHERE username = ?',
			[username]
		);

		const user = users[0];

		// Benutzer und Passwort prüfen
		if (!user || !(await verifyPassword(password, user.password_hash))) {
			return fail(400, {
				error: 'Username or password is incorrect.',
				username
			});
		}

		// Gebannte Benutzer dürfen sich nicht einloggen
		if (user.is_banned === 1) {
			return fail(403, {
				error: 'This account has been banned.',
				username
			});
		}

		// Neue Session erstellen
		const sessionId = await createSession(user.id);

		// Session-Cookie setzen
		cookies.set('session_id', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: 60 * 60 * 24 * 30
		});

		// Nach Login zur Startseite
		redirect(303, '/');
	}
};