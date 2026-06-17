import pool from './db.js';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

// Erstellt aus dem Passwort einen sicheren Hash.
export async function hashPassword(password) {
	return await bcrypt.hash(password, 10);
}

// Vergleicht das eingegebene Passwort mit dem gespeicherten Hash.
export async function verifyPassword(password, hash) {
	return await bcrypt.compare(password, hash);
}

// Erstellt nach dem Login eine neue Session.
export async function createSession(userId) {
	// Zufällige Session-ID erstellen
	const sessionId = randomUUID();

	// Session läuft nach 30 Tagen ab
	const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

	// Session in der Datenbank speichern
	await pool.execute('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)', [
		sessionId,
		userId,
		expiresAt
	]);

	// Diese ID wird später als Cookie gespeichert
	return sessionId;
}

// Prüft, ob ein Benutzer durch eine Session eingeloggt ist.
export async function validateSession(sessionId) {
	// Benutzer zur Session suchen.
	// Gebannte Benutzer werden direkt ausgeschlossen.
	const [rows] = await pool.execute(
		`SELECT u.id, u.username, u.role, u.is_banned
		 FROM sessions s
		 JOIN users u ON s.user_id = u.id
		 WHERE s.id = ? AND s.expires_at > NOW() AND u.is_banned = 0`,
		[sessionId]
	);

	// Wenn keine gültige Session existiert, wird null zurückgegeben.
	return rows[0] ?? null;
}

// Löscht die Session beim Logout.
export async function invalidateSession(sessionId) {
	await pool.execute('DELETE FROM sessions WHERE id = ?', [sessionId]);
}