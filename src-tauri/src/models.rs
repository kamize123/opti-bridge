use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    pub cloudinary_cloud_name: String,
    pub cloudinary_api_key: String,
    pub cloudinary_api_secret: String,
    pub r2_access_key_id: String,
    pub r2_secret_access_key: String,
    pub r2_bucket_name: String,
    pub r2_endpoint: String,
    pub r2_public_domain: String,
    pub settings_max_width: u32,
    pub settings_auto_webp: bool,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            cloudinary_cloud_name: String::new(),
            cloudinary_api_key: String::new(),
            cloudinary_api_secret: String::new(),
            r2_access_key_id: String::new(),
            r2_secret_access_key: String::new(),
            r2_bucket_name: String::new(),
            r2_endpoint: String::new(),
            r2_public_domain: String::new(),
            settings_max_width: 1600,
            settings_auto_webp: true,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProcessedImageResult {
    pub preview_base64: String,
    pub size_info: String,
    pub temp_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UploadResult {
    pub url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HistoryItem {
    pub id: String,
    pub provider: String,
    pub original_name: String,
    pub url: String,
    pub created_at: i64,
    pub thumbnail_base64: String,
}

