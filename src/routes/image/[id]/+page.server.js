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

	const canEditPost = locals.user?.id === image.author_id;
	const canModerateComments = locals.user?.id === image.author_id || locals.user?.role === 'admin';

	return {
		image,
		comments,
		canEditPost,
		canModerateComments,
		user: locals.user
	};
}

export const actions = {
	comment: async ({ request, params, locals }) => {
		if (!locals.user) {
			redirect(303, '/login');
		}

		const formData = await request.formData();
		const text = String(formData.get('text') ?? '').trim();

		if (text.length < 1 || text.length > 300) {
			return fail(400, {
				error: 'Your comment must contain 1 to 300 characters.'
			});
		}

		await pool.execute('INSERT INTO comments (image_id, user_id, text) VALUES (?, ?, ?)', [
			params.id,
			locals.user.id,
			text
		]);

		return {
			commentSuccess: true
		};
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
			return fail(400, {
				voteError: 'You already upvoted this picture.'
			});
		}

		await pool.execute('UPDATE images SET votes = votes + 1 WHERE id = ?', [params.id]);

		return {
			voteSuccess: true
		};
	},

	editDescription: async ({ request, params, locals }) => {
		if (!locals.user) {
			redirect(303, '/login');
		}

		const formData = await request.formData();
		const description = String(formData.get('description') ?? '').trim();

		if (description.length < 3 || description.length > 200) {
			return fail(400, {
				editError: 'Description must have 3 to 200 characters.'
			});
		}

		const [images] = await pool.execute('SELECT author_id FROM images WHERE id = ?', [params.id]);
		const image = images[0];

		if (!image) {
			error(404, 'Image not found.');
		}

		if (image.author_id !== locals.user.id) {
			return fail(403, {
				editError: 'You can only edit your own post.'
			});
		}

		await pool.execute('UPDATE images SET description = ? WHERE id = ?', [description, params.id]);

		return {
			editSuccess: true
		};
	},

	editComment: async ({ request, params, locals }) => {
		if (!locals.user) {
			redirect(303, '/login');
		}

		const formData = await request.formData();
		const commentId = Number(formData.get('commentId'));
		const text = String(formData.get('text') ?? '').trim();

		if (text.length < 1 || text.length > 300) {
			return fail(400, {
				commentEditError: 'Comment must have 1 to 300 characters.'
			});
		}

		const [comments] = await pool.execute(
			'SELECT user_id FROM comments WHERE id = ? AND image_id = ?',
			[commentId, params.id]
		);

		const comment = comments[0];

		if (!comment) {
			return fail(404, {
				commentEditError: 'Comment was not found.'
			});
		}

		if (comment.user_id !== locals.user.id) {
			return fail(403, {
				commentEditError: 'You can only edit your own comment.'
			});
		}

		await pool.execute('UPDATE comments SET text = ? WHERE id = ? AND image_id = ?', [
			text,
			commentId,
			params.id
		]);

		return {
			commentEditSuccess: true
		};
	},

	deleteComment: async ({ request, params, locals }) => {
		if (!locals.user) {
			redirect(303, '/login');
		}

		const formData = await request.formData();
		const commentId = Number(formData.get('commentId'));

		const [images] = await pool.execute('SELECT author_id FROM images WHERE id = ?', [params.id]);
		const image = images[0];

		if (!image) {
			error(404, 'Image not found.');
		}

		const [comments] = await pool.execute(
			'SELECT user_id FROM comments WHERE id = ? AND image_id = ?',
			[commentId, params.id]
		);

		const comment = comments[0];

		if (!comment) {
			return fail(404, {
				deleteError: 'Comment was not found.'
			});
		}

		const isCommentOwner = comment.user_id === locals.user.id;
		const isPostOwner = image.author_id === locals.user.id;
		const isAdmin = locals.user.role === 'admin';

		if (!isCommentOwner && !isPostOwner && !isAdmin) {
			return fail(403, {
				deleteError: 'You are not allowed to delete this comment.'
			});
		}

		await pool.execute('DELETE FROM comments WHERE id = ? AND image_id = ?', [commentId, params.id]);

		return {
			deleteSuccess: true
		};
	}
};