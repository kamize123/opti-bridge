use crate::models::HistoryItem;
use rusqlite::{params, Connection};

pub struct Database {
    conn: Connection,
}

impl Database {
    pub fn new(app_handle: &tauri::AppHandle) -> Result<Self, String> {
        let app_dir = app_handle
            .path_resolver()
            .app_data_dir()
            .ok_or("Failed to get app data directory")?;

        std::fs::create_dir_all(&app_dir)
            .map_err(|e| format!("Failed to create app directory: {}", e))?;

        let db_path = app_dir.join("history.db");

        let conn = Connection::open(&db_path)
            .map_err(|e| format!("Failed to open database: {}", e))?;

        // Create table if not exists
        conn.execute(
            "CREATE TABLE IF NOT EXISTS uploads (
                id TEXT PRIMARY KEY,
                provider TEXT NOT NULL,
                original_name TEXT NOT NULL,
                url TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                thumbnail_base64 TEXT NOT NULL
            )",
            [],
        )
        .map_err(|e| format!("Failed to create table: {}", e))?;

        Ok(Self { conn })
    }

    pub fn insert_history(&self, item: &HistoryItem) -> Result<(), String> {
        self.conn
            .execute(
                "INSERT INTO uploads (id, provider, original_name, url, created_at, thumbnail_base64) 
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
                params![
                    &item.id,
                    &item.provider,
                    &item.original_name,
                    &item.url,
                    &item.created_at,
                    &item.thumbnail_base64
                ],
            )
            .map_err(|e| format!("Failed to insert history: {}", e))?;

        Ok(())
    }

    pub fn get_history(&self) -> Result<Vec<HistoryItem>, String> {
        let mut stmt = self
            .conn
            .prepare("SELECT id, provider, original_name, url, created_at, thumbnail_base64 FROM uploads ORDER BY created_at DESC")
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let items = stmt
            .query_map([], |row| {
                Ok(HistoryItem {
                    id: row.get(0)?,
                    provider: row.get(1)?,
                    original_name: row.get(2)?,
                    url: row.get(3)?,
                    created_at: row.get(4)?,
                    thumbnail_base64: row.get(5)?,
                })
            })
            .map_err(|e| format!("Failed to query history: {}", e))?
            .collect::<Result<Vec<_>, _>>()
            .map_err(|e| format!("Failed to collect results: {}", e))?;

        Ok(items)
    }

    pub fn delete_history(&self, id: &str) -> Result<(), String> {
        self.conn
            .execute("DELETE FROM uploads WHERE id = ?1", params![id])
            .map_err(|e| format!("Failed to delete history: {}", e))?;

        Ok(())
    }
}

