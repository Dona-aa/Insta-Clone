import { invalidateSession } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const actions = {
	logout: async ({ cookies }) => {
		const sessionId = cookies.get('session_id');
		if (sessionId) {
			await invalidateSession(sessionId);
			cookies.delete('session_id', { path: '/' });
		}
		redirect(303, '/');
	}
};