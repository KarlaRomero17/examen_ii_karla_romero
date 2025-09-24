export async function initializeDatabase(db) {
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      telephone TEXT NOT NULL,
      birthdate TEXT NOT NULL,
      email TEXT NOT NULL
    );
  `);
}

