# 🚀 HƯỚNG DẪN TIẾNG VIỆT - OptiBridge

Chào mừng bạn đến với OptiBridge! Đây là ứng dụng desktop hoàn chỉnh để tải lên và tối ưu hóa hình ảnh.

## ✅ Trạng Thái Dự Án: HOÀN THÀNH

Tất cả tính năng trong blueprint đã được triển khai. Ứng dụng sẵn sàng cho production.

## 🎯 Bắt Đầu Nhanh (3 Bước)

### Bước 1: Cài Đặt Yêu Cầu

Bạn cần **Rust** và **thư viện hệ thống**:

```bash
# Cài Rust (nếu chưa có)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Cài các thư viện hệ thống (Ubuntu/Debian)
sudo apt update && sudo apt install -y \
    libwebkit2gtk-4.0-dev \
    build-essential \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    patchelf
```

### Bước 2: Thiết Lập Dự Án

```bash
# Chạy script thiết lập (cài Node dependencies)
./setup.sh

# Hoặc thủ công
npm install
```

### Bước 3: Khởi Chạy Ứng Dụng

```bash
npm run tauri:dev
```

Xong! Ứng dụng sẽ mở trong cửa sổ mới.

## 📖 Tài Liệu

| Tài Liệu | Khi Nào Đọc |
|----------|-------------|
| **START_HERE.md** | Bắt đầu (tiếng Anh) |
| **QUICKSTART.md** | Hướng dẫn sử dụng nhanh |
| **README.md** | Tổng quan về dự án |
| **DEVELOPMENT.md** | Phát triển và đóng góp code |
| **PROJECT_SUMMARY.md** | Tài liệu kỹ thuật đầy đủ |

## 🎨 Tính Năng Ứng Dụng

### 1. Tải Lên Hình Ảnh
- ✅ Kéo thả hình ảnh
- ✅ Chọn file từ máy tính
- ✅ Dán từ clipboard (Ctrl+V)
- ✅ Tự động resize và tối ưu (WebP)

### 2. Upload Lên Cloud
- ✅ Hỗ trợ Cloudinary
- ✅ Hỗ trợ Cloudflare R2
- ✅ Copy URL chỉ với 1 click

### 3. Lịch Sử Upload
- ✅ Xem tất cả uploads trước đó
- ✅ Copy URL ngay lập tức
- ✅ Xóa uploads cũ

### 4. Cài Đặt
- ✅ Cấu hình thông tin cloud
- ✅ Đặt độ rộng tối đa cho ảnh
- ✅ Bật/tắt chuyển đổi WebP

## ⚙️ Cấu Hình

Trước khi upload, cấu hình nhà cung cấp cloud trong tab **Settings**:

### Thiết Lập Cloudinary
1. Đăng ký tại [cloudinary.com](https://cloudinary.com)
2. Lấy thông tin từ dashboard
3. Nhập: Cloud Name, API Key, API Secret

### Thiết Lập Cloudflare R2
1. Tạo R2 bucket trong Cloudflare
2. Tạo API tokens
3. Nhập: Access Key, Secret Key, Bucket Name, Endpoint, Public Domain

## 🏗️ Cấu Trúc Dự Án

```
opti-bridge/
├── src/                  # Frontend React
│   ├── components/       # Các component UI
│   │   ├── common/       # Button, Input, Tabs, v.v.
│   │   └── features/     # GreetTest (test IPC)
│   ├── pages/           # Các view chính
│   │   ├── UploadView.tsx     # Giao diện upload
│   │   ├── HistoryView.tsx    # Lịch sử
│   │   └── SettingsView.tsx   # Cài đặt
│   ├── state/           # Quản lý state (Zustand)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities
│   └── App.tsx          # Component chính
│
├── src-tauri/           # Backend Rust
│   ├── src/
│   │   ├── commands/    # Các lệnh IPC
│   │   │   ├── image_cmds.rs      # Xử lý ảnh
│   │   │   ├── upload_cmds.rs     # Upload cloud
│   │   │   ├── history_cmds.rs    # Lịch sử
│   │   │   └── config_cmds.rs     # Cấu hình
│   │   ├── modules/     # Logic nghiệp vụ
│   │   │   ├── image_processor.rs # Xử lý ảnh
│   │   │   ├── database.rs        # SQLite
│   │   │   └── config_manager.rs  # Quản lý config
│   │   ├── uploaders/   # Các nhà cung cấp cloud
│   │   │   ├── cloudinary.rs
│   │   │   └── r2.rs
│   │   ├── models.rs    # Cấu trúc dữ liệu
│   │   ├── state.rs     # App state
│   │   └── main.rs      # Entry point Rust
│   ├── Cargo.toml       # Dependencies Rust
│   └── tauri.conf.json  # Cấu hình Tauri
│
└── Các file tài liệu
```

## 🔧 Các Lệnh Phát Triển

```bash
# Khởi động phát triển (hot reload)
npm run tauri:dev

# Build production
npm run tauri:build

# Chỉ frontend (nhanh hơn)
npm run dev

# Kiểm tra TypeScript
npx tsc --noEmit

# Kiểm tra Rust code
cd src-tauri && cargo check
```

## 🧪 Kiểm Tra Ứng Dụng

1. **Kiểm tra IPC Connection**:
   - Vào tab Settings
   - Dùng widget "IPC Test: Greet Command"
   - Nhập tên và nhấn Greet
   - Nên thấy: "Hello, {tên}! Welcome to OptiBridge."

2. **Kiểm tra Xử Lý Ảnh**:
   - Vào tab Upload
   - Kéo thả một ảnh
   - Nên thấy preview và thông tin size

3. **Kiểm tra Upload** (cần cấu hình cloud):
   - Xử lý một ảnh
   - Chọn provider
   - Nhấn "Upload to Cloud"
   - Nên nhận được URL

## 🎓 Luồng Dữ Liệu

```
1. Input (User)
   ├── Kéo thả file
   ├── Chọn file từ dialog
   └── Dán từ clipboard
   
2. Xử lý (Rust)
   ├── Load ảnh
   ├── Resize (nếu > 1600px)
   ├── Chuyển sang WebP
   └── Tạo Base64 preview
   
3. Upload (Cloud)
   ├── Chọn provider (Cloudinary/R2)
   ├── Upload qua API
   └── Nhận URL public
   
4. Lưu trữ
   ├── Lưu vào SQLite
   ├── Tạo thumbnail
   └── Hiển thị trong History
```

## 💾 Lưu Trữ Dữ Liệu

Ứng dụng lưu dữ liệu tại:
- **Linux**: `~/.local/share/com.optibridge.app/`
- **macOS**: `~/Library/Application Support/com.optibridge.app/`
- **Windows**: `%APPDATA%\com.optibridge.app\`

Các file được lưu:
- `config.json` - Cài đặt và API keys
- `history.db` - Database SQLite cho lịch sử upload

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **React 18**: Framework UI
- **TypeScript 5**: An toàn kiểu dữ liệu
- **Vite 5**: Build tool nhanh
- **TailwindCSS 3**: CSS utility-first
- **Shadcn/UI**: Thư viện component
- **Zustand**: Quản lý state
- **React Dropzone**: Drag & drop
- **Lucide React**: Icons

### Backend
- **Rust**: Ngôn ngữ hệ thống
- **Tauri 1.5**: Framework desktop
- **image**: Xử lý ảnh
- **reqwest**: HTTP client
- **rusqlite**: SQLite database
- **arboard**: Truy cập clipboard
- **aws-sdk-s3**: Upload R2
- **chrono, uuid, base64**: Utilities

## 🎯 Các Tính Năng Chính

### Xử Lý Ảnh (Native Rust)
- ✅ Resize tự động (max 1600px, có thể config)
- ✅ Chuyển đổi WebP (giảm kích thước file)
- ✅ Giữ nguyên tỷ lệ khung hình
- ✅ Preview Base64 trong UI
- ✅ Cache tạm trong RAM

### Upload Cloud
- ✅ **Cloudinary**: Upload với signed request
- ✅ **Cloudflare R2**: Upload qua S3 SDK
- ✅ Tạo thumbnail cho lịch sử
- ✅ Lưu metadata vào database
- ✅ Trả về URL public

### Quản Lý
- ✅ Lịch sử persistent (SQLite)
- ✅ Copy URL một click
- ✅ Xóa khỏi lịch sử
- ✅ Xem thumbnail
- ✅ Sắp xếp theo thời gian

## ❓ Xử Lý Sự Cố

### Ứng dụng không khởi động
```bash
# Kiểm tra Rust
rustc --version

# Kiểm tra Node
node --version

# Cài lại dependencies
rm -rf node_modules
npm install

# Clean Rust build
cd src-tauri && cargo clean
```

### Lỗi TypeScript
```bash
# Xem tất cả lỗi
npx tsc --noEmit

# Kiểm tra import paths
```

### Lỗi biên dịch Rust
```bash
# Update Rust
rustup update stable

# Clean và rebuild
cd src-tauri
cargo clean
cargo build
```

### Upload thất bại
- ✅ Kiểm tra API credentials trong Settings
- ✅ Kiểm tra kết nối internet
- ✅ Xem error message trong console

## 📝 Các Lệnh IPC (Tauri Commands)

Giao tiếp giữa Frontend và Backend:

| Command | Tham Số | Trả Về | Mô Tả |
|---------|---------|--------|-------|
| `greet` | `name: String` | `String` | Test IPC |
| `process_image_from_file` | `path: String` | `ProcessedImageResult` | Xử lý từ file |
| `process_image_from_clipboard` | - | `ProcessedImageResult` | Xử lý từ clipboard |
| `upload_image` | `temp_id`, `provider` | `UploadResult` | Upload lên cloud |
| `get_history` | - | `Vec<HistoryItem>` | Lấy lịch sử |
| `delete_history_item` | `id`, `url`, `provider` | `()` | Xóa lịch sử |
| `get_config` | - | `Config` | Lấy cấu hình |
| `save_config` | `config: Config` | `()` | Lưu cấu hình |

## 🚀 Build Production

```bash
# Build ứng dụng
npm run tauri:build

# File output:
# - Binary: src-tauri/target/release/opti-bridge
# - Installers: src-tauri/target/release/bundle/
#   * .deb (Ubuntu/Debian)
#   * .AppImage (Linux portable)
#   * .dmg (macOS)
#   * .msi (Windows)
```

## 💡 Tips & Tricks

1. **Phát triển nhanh**: Dùng `npm run dev` cho UI (nhanh hơn full Tauri)
2. **Debug**: Mở DevTools (F12) trong dev mode
3. **Rust logs**: Xem terminal output
4. **Hot reload**: Frontend tự động reload; Rust cần restart
5. **Clean build**: Khi có vấn đề, clean và rebuild

## 🎉 Bạn Đã Sẵn Sàng!

Mọi thứ đã được thiết lập. Bắt đầu với:

```bash
npm run tauri:dev
```

Chúc bạn sử dụng OptiBridge vui vẻ! 🚀

## 📚 Tài Liệu Thêm

### Tiếng Anh
- **START_HERE.md** - Bắt đầu nhanh
- **QUICKSTART.md** - Hướng dẫn sử dụng
- **DEVELOPMENT.md** - Hướng dẫn phát triển chi tiết
- **PROJECT_SUMMARY.md** - Tài liệu kỹ thuật đầy đủ
- **README.md** - Tổng quan dự án

## 🔥 Tính Năng Nổi Bật

1. **Hiệu Suất Cao**: Xử lý ảnh bằng Rust native (rất nhanh)
2. **An Toàn Kiểu**: TypeScript + Rust (tránh lỗi runtime)
3. **UI Đẹp**: TailwindCSS + Shadcn/UI (hiện đại, tối giản)
4. **Cross-Platform**: Chạy trên Linux, macOS, Windows
5. **Tối Ưu Tự Động**: Resize + WebP conversion
6. **Lịch Sử Persistent**: SQLite database
7. **Nhiều Input**: Drag & drop, file picker, clipboard
8. **2 Cloud Providers**: Cloudinary và R2

## 🎯 Workflow Điển Hình

```
1. Screenshot (Ctrl+Shift+Print)
2. Mở OptiBridge
3. Nhấn "Paste from Clipboard"
4. Chọn provider (Cloudinary/R2)
5. Nhấn "Upload to Cloud"
6. Copy URL
7. Dán vào blog post
```

Thời gian: ~10 giây! ⚡

## 🏆 Hoàn Thành 100%

✅ Tất cả 14 tasks trong blueprint đã hoàn thành
✅ Frontend hoàn chỉnh với React + TypeScript
✅ Backend hoàn chỉnh với Rust + Tauri
✅ Tài liệu đầy đủ (tiếng Anh và tiếng Việt)
✅ Sẵn sàng cho production

---

**OptiBridge v1.0.0**

Được xây dựng với ❤️ sử dụng React + Tauri + Rust

**Tác giả**: OptiBridge Team  
**License**: MIT  
**Ngày phát hành**: 13/11/2024

