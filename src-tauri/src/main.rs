// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod models;
mod modules;
mod state;
mod uploaders;

use commands::config_cmds::{get_config, save_config};
use commands::history_cmds::{delete_history_item, get_history};
use commands::image_cmds::{greet, process_image_from_clipboard, process_image_from_file};
use commands::upload_cmds::upload_image;
use state::AppState;

fn main() {
    tauri::Builder::default()
        .manage(AppState::new())
        .invoke_handler(tauri::generate_handler![
            greet,
            process_image_from_file,
            process_image_from_clipboard,
            upload_image,
            get_history,
            delete_history_item,
            get_config,
            save_config,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

