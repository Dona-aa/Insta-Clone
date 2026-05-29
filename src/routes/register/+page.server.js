import { db } from '$lib/server/db';
import bcrypt from 'bcrypt';
import { redirect, fail } from '@sveltejs/kit';

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    const name = data.get('name');
    const email = data.get('email');
    const password = data.get('password');

    if (!name || !email || !password) {
      return fail(400, { error: 'Please fill in all fields.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );
    } catch (error) {
      return fail(400, { error: 'Email already exists.' });
    }

    throw redirect(303, '/login');
  }
};