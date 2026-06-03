import { validateSession } from '$lib/server/auth';

export async function handle({ event, resolve }) {
	const sessionId = event.cookies.get('session_id');
	event.locals.user = sessionId ? await validateSession(sessionId) : null;
	return await resolve(event);
}
