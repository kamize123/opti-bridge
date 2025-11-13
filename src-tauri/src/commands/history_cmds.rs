use crate::models::HistoryItem;
use crate::modules::database::Database;

#[tauri::command]
pub fn get_history(app_handle: tauri::AppHandle) -> Result<Vec<HistoryItem>, String> {
    let db = Database::new(&app_handle)?;
    db.get_history()
}

#[tauri::command]
pub fn delete_history_item(
    id: String,
    _url: String,
    _provider: String,
    app_handle: tauri::AppHandle,
) -> Result<(), String> {
    // Delete from database
    let db = Database::new(&app_handle)?;
    db.delete_history(&id)?;

    // TODO: Optionally delete from cloud provider
    // This would require implementing delete methods in cloudinary.rs and r2.rs
    
    Ok(())
}

