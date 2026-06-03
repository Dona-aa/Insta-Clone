import { db } from '$lib/server/db';
import bcrypt from 'bcrypt';
import { redirect, fail } from '@sveltejs/kit';

export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();

    const email = data.get('email');
    const password = data.get('password');

    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    const user = users[0];

    if (!user) {
      return fail(400, { error: 'Wrong email or password.' });
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (!passwordIsCorrect) {
      return fail(400, { error: 'Wrong email or password.' });
    }

    cookies.set('user_id', user.id, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    });

    throw redirect(303, '/');
  }
};