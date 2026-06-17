// Diese Funktion gibt Daten an das Layout weiter.
export function load({ locals }) {
	return {
		// Der eingeloggte Benutzer wird für die Navigation gebraucht.
		user: locals.user
	};
}