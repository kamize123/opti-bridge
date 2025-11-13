use image::{imageops::FilterType, DynamicImage, ImageFormat, GenericImageView};
use std::io::Cursor;

pub struct ImageProcessor {
    max_width: u32,
}

impl ImageProcessor {
    pub fn new(max_width: u32) -> Self {
        Self { max_width }
    }

    pub fn process_from_path(&self, path: &str) -> Result<Vec<u8>, String> {
        let img = image::open(path)
            .map_err(|e| format!("Failed to open image: {}", e))?;
        
        self.process_image(img)
    }

    pub fn process_from_bytes(&self, bytes: &[u8]) -> Result<Vec<u8>, String> {
        let img = image::load_from_memory(bytes)
            .map_err(|e| format!("Failed to load image from memory: {}", e))?;
        
        self.process_image(img)
    }

    fn process_image(&self, img: DynamicImage) -> Result<Vec<u8>, String> {
        let (width, height) = img.dimensions();
        
        // Resize if needed
        let processed = if width > self.max_width {
            let new_height = (height as f64 * (self.max_width as f64 / width as f64)) as u32;
            img.resize(self.max_width, new_height, FilterType::Lanczos3)
        } else {
            img
        };

        // Convert to WebP
        let mut buffer = Vec::new();
        let mut cursor = Cursor::new(&mut buffer);
        
        processed
            .write_to(&mut cursor, ImageFormat::WebP)
            .map_err(|e| format!("Failed to encode as WebP: {}", e))?;

        Ok(buffer)
    }

    pub fn create_thumbnail(&self, bytes: &[u8], max_size: u32) -> Result<Vec<u8>, String> {
        let img = image::load_from_memory(bytes)
            .map_err(|e| format!("Failed to load image: {}", e))?;
        
        let thumbnail = img.thumbnail(max_size, max_size);
        
        let mut buffer = Vec::new();
        let mut cursor = Cursor::new(&mut buffer);
        
        thumbnail
            .write_to(&mut cursor, ImageFormat::WebP)
            .map_err(|e| format!("Failed to encode thumbnail: {}", e))?;

        Ok(buffer)
    }

    pub fn get_size_info(&self, bytes: &[u8]) -> String {
        let kb = bytes.len() as f64 / 1024.0;
        if kb < 1024.0 {
            format!("{:.2} KB", kb)
        } else {
            format!("{:.2} MB", kb / 1024.0)
        }
    }
}

