import { error } from '@sveltejs/kit';
import pool from '$lib/server/db.js';

export async function load({ params }) {
	const [users] = await pool.execute('SELECT id, username FROM users WHERE id = ?', [params.id]);
	const profile = users[0];

	if (!profile) {
		error(404, 'User not found.');
	}

	const [images] = await pool.execute(
		`SELECT id, image, description, votes, created_at
		 FROM images
		 WHERE author_id = ?
		 ORDER BY created_at DESC`,
		[params.id]
	);

	return { profile, images };
}