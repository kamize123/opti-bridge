use reqwest::blocking::multipart;
use sha1::{Digest, Sha1};
use std::time::{SystemTime, UNIX_EPOCH};

pub struct CloudinaryUploader {
    cloud_name: String,
    api_key: String,
    api_secret: String,
}

impl CloudinaryUploader {
    pub fn new(cloud_name: String, api_key: String, api_secret: String) -> Self {
        Self {
            cloud_name,
            api_key,
            api_secret,
        }
    }

    pub fn upload(&self, image_data: &[u8], filename: &str) -> Result<String, String> {
        // Generate timestamp
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();

        // Generate signature
        let signature_string = format!("timestamp={}{}", timestamp, self.api_secret);
        let mut hasher = Sha1::new();
        hasher.update(signature_string.as_bytes());
        let signature = hex::encode(hasher.finalize());

        // Build multipart form
        let file_part = multipart::Part::bytes(image_data.to_vec())
            .file_name(filename.to_string())
            .mime_str("image/webp")
            .map_err(|e| format!("Failed to create file part: {}", e))?;

        let form = multipart::Form::new()
            .part("file", file_part)
            .text("timestamp", timestamp.to_string())
            .text("api_key", self.api_key.clone())
            .text("signature", signature);

        // Upload
        let url = format!(
            "https://api.cloudinary.com/v1_1/{}/image/upload",
            self.cloud_name
        );

        let client = reqwest::blocking::Client::new();
        let response = client
            .post(&url)
            .multipart(form)
            .send()
            .map_err(|e| format!("Upload request failed: {}", e))?;

        if !response.status().is_success() {
            let error_text = response.text().unwrap_or_else(|_| "Unknown error".to_string());
            return Err(format!("Upload failed: {}", error_text));
        }

        let json: serde_json::Value = response
            .json()
            .map_err(|e| format!("Failed to parse response: {}", e))?;

        let public_url = json["secure_url"]
            .as_str()
            .ok_or("No URL in response")?
            .to_string();

        Ok(public_url)
    }
}

