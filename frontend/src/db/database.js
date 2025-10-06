export async function initializeDatabase(db) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS movies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                genre TEXT NOT NULL,
                year INTEGER NOT NULL,
                rating REAL,
                director TEXT,
                duration TEXT,
                watched BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
  `);
}

