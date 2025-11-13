use std::collections::HashMap;
use std::sync::Mutex;

pub struct AppState {
    pub image_cache: Mutex<HashMap<String, Vec<u8>>>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            image_cache: Mutex::new(HashMap::new()),
        }
    }
}

