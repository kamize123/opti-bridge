use crate::models::ProcessedImageResult;
use crate::modules::config_manager::ConfigManager;
use crate::modules::image_processor::ImageProcessor;
use crate::state::AppState;
use arboard::Clipboard;
use tauri::State;
use uuid::Uuid;
use base64::{Engine as _, engine::general_purpose};

#[tauri::command]
pub fn process_image_from_file(
    path: String,
    state: State<AppState>,
    app_handle: tauri::AppHandle,
) -> Result<ProcessedImageResult, String> {
    // Load config to get max width
    let config_manager = ConfigManager::new(&app_handle)?;
    let config = config_manager.load_config()?;

    // Process image
    let processor = ImageProcessor::new(config.settings_max_width);
    let processed_bytes = processor.process_from_path(&path)?;

    // Generate preview (Base64)
    let preview_base64 = general_purpose::STANDARD.encode(&processed_bytes);

    // Get size info
    let size_info = processor.get_size_info(&processed_bytes);

    // Generate temp ID and store in cache
    let temp_id = Uuid::new_v4().to_string();
    let mut cache = state.image_cache.lock().unwrap();
    cache.insert(temp_id.clone(), processed_bytes);

    Ok(ProcessedImageResult {
        preview_base64,
        size_info,
        temp_id,
    })
}

#[tauri::command]
pub fn process_image_from_clipboard(
    state: State<AppState>,
    app_handle: tauri::AppHandle,
) -> Result<ProcessedImageResult, String> {
    // Get image from clipboard
    let mut clipboard = Clipboard::new().map_err(|e| format!("Failed to access clipboard: {}", e))?;
    
    let image = clipboard
        .get_image()
        .map_err(|e| format!("No image in clipboard: {}", e))?;

    // Convert arboard ImageData to bytes
    let width = image.width;
    let height = image.height;
    let rgba_data = image.bytes;

    // Create image from raw RGBA data
    let img_buffer = image::RgbaImage::from_raw(width as u32, height as u32, rgba_data.to_vec())
        .ok_or("Failed to create image from clipboard data")?;
    
    let dynamic_img = image::DynamicImage::ImageRgba8(img_buffer);
    
    // Save to temporary buffer in PNG format
    let mut temp_buffer = Vec::new();
    let mut cursor = std::io::Cursor::new(&mut temp_buffer);
    dynamic_img
        .write_to(&mut cursor, image::ImageFormat::Png)
        .map_err(|e| format!("Failed to encode clipboard image: {}", e))?;

    // Load config to get max width
    let config_manager = ConfigManager::new(&app_handle)?;
    let config = config_manager.load_config()?;

    // Process image
    let processor = ImageProcessor::new(config.settings_max_width);
    let processed_bytes = processor.process_from_bytes(&temp_buffer)?;

    // Generate preview (Base64)
    let preview_base64 = general_purpose::STANDARD.encode(&processed_bytes);

    // Get size info
    let size_info = processor.get_size_info(&processed_bytes);

    // Generate temp ID and store in cache
    let temp_id = Uuid::new_v4().to_string();
    let mut cache = state.image_cache.lock().unwrap();
    cache.insert(temp_id.clone(), processed_bytes);

    Ok(ProcessedImageResult {
        preview_base64,
        size_info,
        temp_id,
    })
}

#[tauri::command]
pub fn greet(name: String) -> String {
    format!("Hello, {}! Welcome to OptiBridge.", name)
}

