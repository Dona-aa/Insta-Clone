import pool from '$lib/server/database.js';

export async function load() {
	const [images] = await pool.execute(
		`SELECT i.id, i.image, i.description, i.votes, i.created_at,
		        u.id AS author_id, u.username
		 FROM images i
		 JOIN users u ON u.id = i.author_id
		 ORDER BY i.created_at DESC
		 LIMIT 25`
	);

	const [topImages] = await pool.execute(
		`SELECT i.id, i.image, i.description, i.votes, u.username
		 FROM images i
		 JOIN users u ON u.id = i.author_id
		 ORDER BY i.votes DESC, i.created_at DESC
		 LIMIT 3`
	);

	return { images, topImages };
}