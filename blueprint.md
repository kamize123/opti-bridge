Project Blueprint: OptiBridge

1. Overview

OptiBridge is a high-performance desktop application built with Tauri (Rust) and React. It functions as an "all-in-one" image uploader for technical bloggers.
Core Mission: Streamline the flow of "Capture -> Optimize -> Upload -> Paste Link".

2. Project Structure (Kiến trúc Thư mục)

Đây là cấu trúc monorepo được đề xuất để tách biệt rõ ràng logic Frontend (View) và Backend (Core).

opti-bridge/
├── src/                  <-- **FRONTEND** (React + Vite)
│   ├── components/       <-- Các component UI (Shadcn)
│   │   ├── layout/       <-- (Sidebar, Header, Tabs)
│   │   ├── common/       <-- (Button, Input, Dropzone)
│   │   └── features/     <-- (HistoryList, SettingsForm)
│   ├── hooks/            <-- (useClipboard, useTauri)
│   ├── lib/              <-- (shadcn utils, tauri-api)
│   ├── pages/            <-- (Hoặc "views/")
│   │   ├── UploadView.tsx
│   │   ├── HistoryView.tsx
│   │   └── SettingsView.tsx
│   ├── state/            <-- (Zustand store)
│   │   └── appStore.ts
│   ├── styles/
│   │   └── globals.css
│   └── main.tsx          <-- React entry point
├── src-tauri/            <-- **BACKEND** (Rust)
│   ├── build.rs          <-- (Script build nếu cần)
│   ├── icons/            <-- (Icon app)
│   ├── src/
│   │   ├── commands/     <-- (Các module cho từng command)
│   │   │   ├── mod.rs
│   │   │   ├── image_cmds.rs
│   │   │   ├── upload_cmds.rs
│   │   │   └── history_cmds.rs
│   │   ├── modules/      <-- (Logic nghiệp vụ lõi)
│   │   │   ├── mod.rs
│   │   │   ├── image_processor.rs
│   │   │   ├── database.rs
│   │   │   └── config_manager.rs
│   │   ├── uploaders/    <-- (Logic cho từng provider)
│   │   │   ├── mod.rs
│   │   │   ├── cloudinary.rs
│   │   │   └── r2.rs
│   │   ├── state.rs      <-- (Tauri Managed State, ví dụ Mutex)
│   │   ├── models.rs     <-- (Các struct (Config, HistoryItem))
│   │   └── main.rs       <-- Rust entry point, setup app
│   ├── Cargo.toml        <-- Quản lý Rust dependencies
│   └── tauri.conf.json   <-- Cấu hình app (tên, quyền, API)
├── package.json          <-- Quản lý JS dependencies
└── tailwind.config.js


3. Tech Stack (Công nghệ)

Core: Tauri v1.x (or v2)

Backend (System): Rust

Frontend: React (Vite), TypeScript, TailwindCSS, Shadcn/UI.

State Management: Zustand (Frontend), Mutex/RwLock (Rust Tauri State).

Storage: SQLite (via rusqlite) for history; tauri-plugin-store for config.

Rust Crates (Thư viện Rust):

serde, serde_json: Để (de)serialize data.

reqwest: HTTP client để gọi API upload.

image: Xử lý ảnh (Resize, Convert WebP).

arboard (hoặc tauri::clipboard): Đọc ảnh từ clipboard.

rusqlite: Database SQLite.

aws-sdk-s3: SDK cho Cloudflare R2.

chrono: Xử lý thời gian.

uuid: Tạo ID duy nhất.

base64: Encode/Decode ảnh preview.

4. Key Features & Logic (Tính năng)

A. Input Sources (Hybrid)

Clipboard Monitor: Detect image data in clipboard (Ctrl+V or paste button).

File Dropzone: Drag & drop support.

File Dialog: System file picker (dialog feature in tauri.conf.json).

B. Image Processing Pipeline (Rust Native)

Performance critical. Must happen in Rust thread, not JS.

Ingest: Load image from Clipboard (Bitmap) or File Path.

Resize:

Constraint: Max Width = 1600px (Configurable in settings).

Logic: If width > 1600px, resize using image::imageops::FilterType::Lanczos3. Else, keep original.

Format Conversion:

Target: WebP.

Quality: Lossless for screenshots (default), or High Quality (e.g., 85) for photos.

Preview Generation: Return a Base64 string of the optimized image to Frontend.

C. Upload Providers (Strategy Pattern)

Cloudinary:

Auth: cloud_name, api_key, api_secret.

Method: Signed multipart/form-data upload API.

Cloudflare R2 (S3 Compatible):

Auth: access_key_id, secret_access_key, bucket_name, endpoint, public_domain.

Method: AWS S3 SDK (rust aws-sdk-s3 crate).

D. Output

Return raw public URL (Link trần).

UI provides "One-click Copy" button.

5. Architecture & Data Flow (Luồng Dữ liệu)

Frontend: User drops file/pastes image -> UI calls Tauri Command process_image(payload: {path: Option<String>, clipboard: Option<bool>}).

Rust: process_image command (trong image_cmds.rs) gọi image_processor.rs -> "Image Processing Pipeline" chạy -> Stores OptimizedImageBlob (Vec<u8>) in a Mutex<HashMap<String, Vec<u8>>> (trong state.rs) with a temporary UUID -> Returns Ok({ preview_base64: String, size_info: String, temp_id: String }) to Frontend.

Frontend: Displays Preview. User clicks "Upload". UI calls Tauri Command upload_image(temp_id: String, provider: String).

Rust: upload_image command (trong upload_cmds.rs) retrieves Blob from memory using temp_id -> Calls the correct Uploader module (uploaders/cloudinary.rs hoặc uploaders/r2.rs) -> On success, saves metadata to SQLite (gọi database.rs) -> Returns Ok({ url: String }).

Frontend: Displays the final URL and copy button.

6. Data Models (Mô hình Dữ liệu)

Config (via tauri-plugin-store)

Đây là file JSON hợp lệ được quản lý bởi tauri-plugin-store.

{
  "cloudinary_cloud_name": "...",
  "cloudinary_api_key": "...",
  "cloudinary_api_secret": "...",
  "r2_access_key_id": "...",
  "r2_secret_access_key": "...",
  "r2_bucket_name": "...",
  "r2_endpoint": "...",
  "r2_public_domain": "...",
  "settings_max_width": 1600,
  "settings_auto_webp": true
}


History (SQLite Table: uploads)

id: TEXT (primary key, e.g., UUID)

provider: TEXT ('cloudinary' | 'r2')

original_name: TEXT (e.g., 'screenshot-1.png' or 'clipboard')

url: TEXT (the final public URL)

created_at: INTEGER (Unix timestamp)

thumbnail_base64: TEXT (small Base64 preview for history UI)

7. UI/UX Requirements (Yêu cầu Giao diện)

Theme: Giao diện hiện đại, tối giản (Minimalist), tông màu chủ đạo là Trắng/Đen (Monochrome).

Styling: Dùng Shadcn/UI (hoặc component library tương tự) với theme "neutral" (đen, trắng, xám). Tập trung vào typography (font chữ rõ ràng) và không gian trắng (whitespace). Không dùng màu sắc sặc sỡ, trừ khi báo lỗi (màu đỏ).

Main View (Upload): Clean Dropzone. When active (image loaded) -> Split view (Preview left, Settings/Upload button right).

History Tab: Grid/List view of past uploads with "Copy Link" and "Delete" buttons (which triggers a delete_from_cloud command).

Settings Tab: Input fields for API Keys (must be obscured, type="password").

8. Project Checkpoints (Tasks)

Lộ trình này chia dự án thành các giai đoạn dễ quản lý.

Giai đoạn 1: Khung sườn & Hạ tầng (1-2 ngày)

[ ] Task 1.1 (Setup): Khởi tạo dự án Tauri (react-ts template). Cài đặt TailwindCSS + Shadcn/UI. Áp dụng cấu trúc thư mục ở Mục 2.

[ ] Task 1.2 (UI Shell): Tạo layout chính (dùng Tabs của Shadcn) với 3 tab: "Upload", "History", "Settings".

[ ] Task 1.3 (IPC Test): Tạo một Rust command greet(name: String) đơn giản (trong commands/mod.rs) và gọi nó từ React để xác nhận kết nối Front-Back.

Giai đoạn 2: Lõi xử lý ảnh (Rust) (2-3 ngày)

[ ] Task 2.1 (File Input): Implement Rust command process_image_from_file(path: String) (trong commands/image_cmds.rs).

Logic: Tải file -> Gọi image_processor.rs để Resize (1600px) -> Convert WebP.

[ ] Task 2.2 (Preview): Trả về một chuỗi Base64 của ảnh đã xử lý cho React.

[ ] Task 2.3 (UI): Tạo React Dropzone/File Picker (trong pages/UploadView.tsx). Khi chọn file, gọi process_image_from_file và hiển thị preview Base64.

[ ] Task 2.4 (Clipboard Input): Implement Rust command process_image_from_clipboard() (trong commands/image_cmds.rs).

Logic: Dùng arboard để đọc image bitmap.

Tái sử dụng logic xử lý từ image_processor.rs.

[ ] Task 2.5 (State): Implement Mutex<HashMap> (trong state.rs) để lưu blob Vec<u8> đã xử lý và trả về một temp_id.

Giai đoạn 3: Tích hợp Cloud (3-4 ngày)

[ ] Task 3.1 (Config UI): Tạo UI tab "Settings" (trong pages/SettingsView.tsx). Dùng tauri-plugin-store để lưu/tải API keys.

[ ] Task 3.2 (Cloudinary): Implement module Rust uploaders::cloudinary.

Logic: Xây dựng và gửi một request multipart/form-data đã ký (signed) bằng reqwest.

[ ] Task 3.3 (R2): Implement module Rust uploaders::r2.

Logic: Dùng crate aws-sdk-s3 để put_object.

[ ] Task 3.4 (Upload Command): Tạo command chính upload_image(temp_id: String, provider: String) (trong commands/upload_cmds.rs).

[ ] Task 3.5 (UI): Thêm nút "Upload" và dropdown chọn Provider (trong pages/UploadView.tsx). Khi click, gọi upload_image và hiển thị URL cuối cùng.

Giai đoạn 4: Lịch sử & Dữ liệu (2 ngày)

[ ] Task 4.1 (DB Setup): Tích hợp rusqlite (trong modules/database.rs). Tạo bảng history khi app khởi động.

[ ] Task 4.2 (Save): Sửa command upload_image để chèn một record mới vào SQLite khi upload thành công.

[ ] Task 4.3 (Read): Implement command get_history() (trong commands/history_cmds.rs). Tạo UI tab "History" (pages/HistoryView.tsx) để hiển thị các record.

[ ] Task 4.4 (Delete): Implement command delete_history_item(id: String, url: String, provider: String).

Logic: Gọi API của provider để xóa object khỏi cloud, sau đó xóa khỏi SQLite.

[ ] Task 4.5 (UI): Thêm nút "Delete" và "Copy URL" vào các mục trong lịch sử.

Giai đoạn 5: Hoàn thiện & Đóng gói (1 ngày)

[ ] Task 5.1 (UX): Thêm tùy chọn "Tự động copy URL vào clipboard" (trong pages/SettingsView.tsx).

[ ] Task 5.2 (Errors): Implement xử lý lỗi (ví dụ: "Sai API Key", "Upload thất bại") và hiển thị thông báo (dùng Toast của Shadcn) rõ ràng trên UI.

[ ] Task 5.3 (Build): Cập nhật tauri.conf.json với icon, tên app. Chạy tauri build để tạo file cài đặt (.exe, .deb).