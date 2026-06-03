import pool from '$lib/server/db';
import bcrypt from 'bcrypt';
import { redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request }) => {

        const data = await request.formData();

        const username = data.get('name');
        const email = data.get('email');
        const password = data.get('password');

        const password_hash = await bcrypt.hash(password, 10);

        await pool.query(
            `
            INSERT INTO users
            (username, email, password_hash)
            VALUES (?, ?, ?)
            `,
            [username, email, password_hash]
        );

        throw redirect(303, '/login');
    }
};