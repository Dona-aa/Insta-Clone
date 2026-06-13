import { error, fail, redirect } from '@sveltejs/kit';
import pool from '$lib/server/db.js';

export async function load({ params, locals }) {
	const [images] = await pool.execute(
		`SELECT i.id, i.image, i.description, i.votes, i.created_at,
		        u.id AS author_id, u.username
		 FROM images i
		 JOIN users u ON u.id = i.author_id
		 WHERE i.id = ?`,
		[params.id]
	);

	const image = images[0];

	if (!image) {
		error(404, 'Image not found.');
	}

	const [comments] = await pool.execute(
		`SELECT c.id, c.text, c.created_at, u.id AS user_id, u.username
		 FROM comments c
		 JOIN users u ON u.id = c.user_id
		 WHERE c.image_id = ?
		 ORDER BY c.created_at DESC`,
		[params.id]
	);

const canDeleteComments = locals.user?.id === image.author_id || locals.user?.role === 'admin';

	return { image, comments, canDeleteComments };
}

export const actions = {
	comment: async ({ request, params, locals }) => {
		if (!locals.user) {
			redirect(303, '/login');
		}

		const formData = await request.formData();
		const text = String(formData.get('text') ?? '').trim();

		if (text.length < 1 || text.length > 300) {
			return fail(400, { error: 'Your comment must contain 1 to 300 characters.' });
		}

		await pool.execute('INSERT INTO comments (image_id, user_id, text) VALUES (?, ?, ?)', [
			params.id,
			locals.user.id,
			text
		]);

		return { commentSuccess: true };
	},

	upvote: async ({ params, locals }) => {
		if (!locals.user) {
			redirect(303, '/login');
		}

		const [voteResult] = await pool.execute(
			'INSERT IGNORE INTO votes (image_id, user_id) VALUES (?, ?)',
			[params.id, locals.user.id]
		);

		if (voteResult.affectedRows === 0) {
			return fail(400, { voteError: 'You already upvoted this picture.' });
		}

		await pool.execute('UPDATE images SET votes = votes + 1 WHERE id = ?', [params.id]);

		return { voteSuccess: true };
	},

	deleteComment: async ({ request, params, locals }) => {
		if (!locals.user) {
			redirect(303, '/login');
		}

		const formData = await request.formData();
		const commentId = formData.get('commentId');

		const [images] = await pool.execute('SELECT author_id FROM images WHERE id = ?', [params.id]);
		const image = images[0];

		if (!image) {
			error(404, 'Image not found.');
		}

		if (image.author_id !== locals.user.id && locals.user.role !== 'admin') {
			return fail(403, { deleteError: 'You can only delete comments on your own post.' });
	}

		await pool.execute('DELETE FROM comments WHERE id = ? AND image_id = ?', [commentId, params.id]);

		return { deleteSuccess: true };
	}
};