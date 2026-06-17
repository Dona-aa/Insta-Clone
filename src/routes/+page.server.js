import pool from '$lib/server/db.js';

// Lädt alle Daten für die Startseite.
export async function load() {
	// Die neuesten 25 Bilder werden für den Explore-Bereich geladen.
	const [images] = await pool.execute(
		`SELECT i.id, i.image, i.description, i.votes, i.created_at,
		        u.id AS author_id, u.username
		 FROM images i
		 JOIN users u ON u.id = i.author_id
		 ORDER BY i.created_at DESC
		 LIMIT 25`
	);

	// Die 3 beliebtesten Bilder werden extra geladen.
	// Sie werden nach Votes sortiert.
	const [topImages] = await pool.execute(
		`SELECT i.id, i.image, i.description, i.votes, i.created_at,
		        u.id AS author_id, u.username
		 FROM images i
		 JOIN users u ON u.id = i.author_id
		 ORDER BY i.votes DESC, i.created_at DESC
		 LIMIT 3`
	);

	// Beide Listen werden an +page.svelte gesendet.
	return {
		images,
		topImages
	};
}