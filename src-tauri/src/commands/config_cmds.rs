use crate::models::Config;
use crate::modules::config_manager::ConfigManager;

#[tauri::command]
pub fn get_config(app_handle: tauri::AppHandle) -> Result<Config, String> {
    let config_manager = ConfigManager::new(&app_handle)?;
    config_manager.load_config()
}

#[tauri::command]
pub fn save_config(config: Config, app_handle: tauri::AppHandle) -> Result<(), String> {
    let config_manager = ConfigManager::new(&app_handle)?;
    config_manager.save_config(&config)
}

