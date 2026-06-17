import mysql from 'mysql2/promise';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from '$env/static/private';

// Erstellt die Verbindung zur MySQL-Datenbank.
// Die Daten kommen aus der .env-Datei.
const pool = mysql.createPool({
	host: DB_HOST,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
	port: Number(DB_PORT),

	// Wartet, falls gerade keine freie Verbindung verfügbar ist.
	waitForConnections: true,

	// Maximal 10 Verbindungen gleichzeitig.
	connectionLimit: 10
});

// Der Pool wird in allen Server-Dateien verwendet.
export default pool;