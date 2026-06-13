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

	deleteUser: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			redirect(303, '/');
		}

		const formData = await request.formData();
		const userId = Number(formData.get('userId'));

		if (userId === locals.user.id) {
			return fail(400, {
				error: 'You cannot delete yourself.'
			});
		}

		const [users] = await pool.execute('SELECT id FROM users WHERE id = ? AND role != "admin"', [
			userId
		]);

		if (users.length === 0) {
			return fail(404, {
				error: 'User was not found or cannot be deleted.'
			});
		}

		const [userImages] = await pool.execute('SELECT id, image FROM images WHERE author_id = ?', [
			userId
		]);

		for (const image of userImages) {
			await del(image.image, {
				token: BLOB_READ_WRITE_TOKEN
			});
		}

		await pool.execute(
			`DELETE FROM comments
			 WHERE user_id = ?
			 OR image_id IN (SELECT id FROM images WHERE author_id = ?)`,
			[userId, userId]
		);

		await pool.execute(
			`DELETE FROM votes
			 WHERE user_id = ?
			 OR image_id IN (SELECT id FROM images WHERE author_id = ?)`,
			[userId, userId]
		);

		await pool.execute('DELETE FROM images WHERE author_id = ?', [userId]);
		await pool.execute('DELETE FROM sessions WHERE user_id = ?', [userId]);
		await pool.execute('DELETE FROM users WHERE id = ?', [userId]);

		return {
			success: 'User was fully deleted.'
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

		await pool.execute('DELETE FROM comments WHERE image_id = ?', [imageId]);
		await pool.execute('DELETE FROM votes WHERE image_id = ?', [imageId]);
		await pool.execute('DELETE FROM images WHERE id = ?', [imageId]);

		return {
			success: 'Post was deleted.'
		};
	}
};