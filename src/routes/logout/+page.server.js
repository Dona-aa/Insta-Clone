import { redirect } from '@sveltejs/kit';
import { invalidateSession } from '$lib/server/auth.js';

export const actions = {
	logout: async ({ cookies }) => {
		// Session-ID aus dem Cookie lesen
		const sessionId = cookies.get('session_id');

		// Wenn eine Session existiert, wird sie in der Datenbank gelöscht
		if (sessionId) {
			await invalidateSession(sessionId);

			// Cookie im Browser löschen
			cookies.delete('session_id', {
				path: '/'
			});
		}

		// Nach dem Logout zurück zur Startseite
		redirect(303, '/');
	}
};