import { del } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';
import pool from '$lib/server/db.js';

export async function load({ locals }) {
	if (!locals.user) {
		redirect(303, '/login');
	}

	if (locals.user.role !== 'admin') {
		redirect(303, '/');
	}

	const [users] = await pool.execute(
		`SELECT id, username, email, role, is_banned, created_at
		 FROM users
		 ORDER BY created_at DESC`
	);

	const [images] = await pool.execute(
		`SELECT i.id, i.image, i.description, i.votes, i.created_at, u.username
		 FROM images i
		 JOIN users u ON u.id = i.author_id
		 ORDER BY i.created_at DESC`
	);

	const [comments] = await pool.execute(
		`SELECT c.id, c.text, c.created_at, u.username, i.id AS image_id
		 FROM comments c
		 JOIN users u ON u.id = c.user_id
		 JOIN images i ON i.id = c.image_id
		 ORDER BY c.created_at DESC`
	);

	return {
		users,
		images,
		comments,
		stats: {
			userCount: users.length,
			imageCount: images.length,
			commentCount: comments.length
		}
	};
}

export const actions = {
	banUser: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			redirect(303, '/');
		}

		const formData = await request.formData();
		const userId = Number(formData.get('userId'));

		if (userId === locals.user.id) {
			return fail(400, {
				error: 'You cannot ban yourself.'
			});
		}

		await pool.execute('UPDATE users SET is_banned = 1 WHERE id = ? AND role != "admin"', [userId]);

		return {
			success: 'User was banned.'
		};
	},

	unbanUser: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			redirect(303, '/');
		}

		const formData = await request.formData();
		const userId = Number(formData.get('userId'));

		await pool.execute('UPDATE users SET is_banned = 0 WHERE id = ?', [userId]);

		return {
			success: 'User was unbanned.'
		};
	},

	deleteImage: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			redirect(303, '/');
		}

		const formData = await request.formData();
		const imageId = Number(formData.get('imageId'));

		const [images] = await pool.execute('SELECT image FROM images WHERE id = ?', [imageId]);
		const image = images[0];

		if (!image) {
			return fail(404, {
				error: 'Image was not found.'
			});
		}

		await del(image.image, {
			token: BLOB_READ_WRITE_TOKEN
		});

		await pool.execute('DELETE FROM images WHERE id = ?', [imageId]);

		return {
			success: 'Post was deleted.'
		};
	},

	deleteComment: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			redirect(303, '/');
		}

		const formData = await request.formData();
		const commentId = Number(formData.get('commentId'));

		await pool.execute('DELETE FROM comments WHERE id = ?', [commentId]);

		return {
			success: 'Comment was deleted.'
		};
	}
};