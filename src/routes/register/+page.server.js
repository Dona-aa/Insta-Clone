import { fail, redirect } from '@sveltejs/kit';
import pool from '$lib/server/db.js';
import { request } from 'http';
import { hashPassword, createSession } from '$lib/server/auth';

export const actions = {
	register: async ({ request, cookies }) => {
		const form = await request.formData();
		const username = form.get('username');
		const password = form.get('password');

		if (!username || !password) {
			return fail(400, { error: 'Bitte alle Felder ausfullen' });
		}

		let result;
		try {
			[result] = await pool.execute('INSERT into users (username, password_hash) values (?,?)', [
				username,
				await hashPassword(password)
			]);
		} catch (err) {
			if (err.code === 'ER_DUP_ENTRY') {
				return fail(400, { error: 'Username is already taken!' });
			}
		}
		// create session
		const sessionId = await createSession(result.insertId);
		cookies.set('session_id', sessionId, { path: '/', maxAge: 60 * 60 * 24 * 30 });

		// redirect
		redirect(303, '/admin/events');
	}
};
