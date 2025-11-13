use crate::models::{HistoryItem, UploadResult};
use crate::modules::config_manager::ConfigManager;
use crate::modules::database::Database;
use crate::modules::image_processor::ImageProcessor;
use crate::state::AppState;
use crate::uploaders::cloudinary::CloudinaryUploader;
use crate::uploaders::r2::R2Uploader;
use chrono::Utc;
use tauri::State;
use uuid::Uuid;
use base64::{Engine as _, engine::general_purpose};

#[tauri::command]
pub async fn upload_image(
    temp_id: String,
    provider: String,
    state: State<'_, AppState>,
    app_handle: tauri::AppHandle,
) -> Result<UploadResult, String> {
    // Retrieve image from cache
    let image_data = {
        let cache = state.image_cache.lock().unwrap();
        cache
            .get(&temp_id)
            .cloned()
            .ok_or("Image not found in cache")?
    };

    // Load config
    let config_manager = ConfigManager::new(&app_handle)?;
    let config = config_manager.load_config()?;

    // Upload based on provider
    let url = match provider.as_str() {
        "cloudinary" => {
            let uploader = CloudinaryUploader::new(
                config.cloudinary_cloud_name,
                config.cloudinary_api_key,
                config.cloudinary_api_secret,
            );
            uploader.upload(&image_data, "image.webp")?
        }
        "r2" => {
            let uploader = R2Uploader::new(
                config.r2_access_key_id,
                config.r2_secret_access_key,
                config.r2_bucket_name,
                config.r2_endpoint,
                config.r2_public_domain,
            );
            uploader.upload(&image_data, "image.webp").await?
        }
        _ => return Err("Invalid provider".to_string()),
    };

    // Create thumbnail for history
    let processor = ImageProcessor::new(config.settings_max_width);
    let thumbnail_bytes = processor.create_thumbnail(&image_data, 200)?;
    let thumbnail_base64 = general_purpose::STANDARD.encode(&thumbnail_bytes);

    // Save to history
    let history_item = HistoryItem {
        id: Uuid::new_v4().to_string(),
        provider: provider.clone(),
        original_name: "image.webp".to_string(),
        url: url.clone(),
        created_at: Utc::now().timestamp(),
        thumbnail_base64,
    };

    let db = Database::new(&app_handle)?;
    db.insert_history(&history_item)?;

    // Clear from cache
    {
        let mut cache = state.image_cache.lock().unwrap();
        cache.remove(&temp_id);
    }

    Ok(UploadResult { url })
}

