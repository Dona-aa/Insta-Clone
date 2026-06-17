import { validateSession } from '$lib/server/auth.js';

// Dieser Hook läuft vor jeder Anfrage.
export async function handle({ event, resolve }) {
	// Session-ID aus dem Cookie lesen
	const sessionId = event.cookies.get('session_id');

	// Wenn eine Session existiert, wird der Benutzer geladen.
	// Dadurch kann man später mit locals.user arbeiten.
	event.locals.user = sessionId ? await validateSession(sessionId) : null;

	// Anfrage normal weiter ausführen
	return resolve(event);
}