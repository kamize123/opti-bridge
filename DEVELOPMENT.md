# Development Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher
- **Rust**: Latest stable version (install via [rustup](https://rustup.rs/))
- **System Dependencies** (Linux):
  - `libwebkit2gtk-4.0-dev`
  - `libssl-dev`
  - `libgtk-3-dev`
  - `libappindicator3-dev`
  - `librsvg2-dev`
  - `patchelf`

### Linux Installation

Ubuntu/Debian:
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    patchelf
```

## Project Setup

1. **Clone the repository** (if not already done):
```bash
cd /home/jason12/jasonworking/opti-bridge
```

2. **Install Node dependencies**:
```bash
npm install
```

3. **Check Rust installation**:
```bash
rustc --version
cargo --version
```

## Development Workflow

### Running in Development Mode

```bash
npm run tauri:dev
```

This will:
1. Start the Vite development server on port 1420
2. Compile the Rust backend
3. Launch the Tauri application with hot-reload

### Building for Production

```bash
npm run tauri:build
```

The compiled application will be in `src-tauri/target/release/`.

### Frontend Only (for UI development)

```bash
npm run dev
```

This runs only the Vite dev server without Tauri, useful for quick UI iterations.

## Project Structure

```
opti-bridge/
├── src/                          # React Frontend
│   ├── components/
│   │   └── common/              # Reusable UI components (Shadcn)
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility functions
│   ├── pages/                   # Main application views
│   │   ├── UploadView.tsx       # Upload interface
│   │   ├── HistoryView.tsx      # Upload history
│   │   └── SettingsView.tsx     # Configuration
│   ├── state/                   # Zustand store
│   │   └── appStore.ts
│   ├── styles/                  # Global styles
│   │   └── globals.css
│   ├── App.tsx                  # Main App component
│   └── main.tsx                 # React entry point
│
├── src-tauri/                    # Rust Backend
│   ├── src/
│   │   ├── commands/            # Tauri command handlers
│   │   │   ├── config_cmds.rs   # Config management
│   │   │   ├── history_cmds.rs  # History operations
│   │   │   ├── image_cmds.rs    # Image processing
│   │   │   └── upload_cmds.rs   # Upload logic
│   │   ├── modules/             # Core business logic
│   │   │   ├── config_manager.rs
│   │   │   ├── database.rs      # SQLite operations
│   │   │   └── image_processor.rs
│   │   ├── uploaders/           # Cloud provider implementations
│   │   │   ├── cloudinary.rs
│   │   │   └── r2.rs
│   │   ├── models.rs            # Data structures
│   │   ├── state.rs             # Application state
│   │   └── main.rs              # Rust entry point
│   ├── Cargo.toml               # Rust dependencies
│   └── tauri.conf.json          # Tauri configuration
│
├── package.json                  # Node dependencies
├── tailwind.config.js           # Tailwind CSS config
├── tsconfig.json                # TypeScript config
└── vite.config.ts               # Vite config
```

## Key Technologies

### Frontend
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **TailwindCSS**: Utility-first CSS
- **Shadcn/UI**: Component library
- **Zustand**: State management
- **Lucide React**: Icon library

### Backend
- **Rust**: System programming language
- **Tauri**: Desktop app framework
- **reqwest**: HTTP client
- **image**: Image processing
- **rusqlite**: SQLite database
- **arboard**: Clipboard access
- **aws-sdk-s3**: S3-compatible storage (R2)

## Available Commands

### Development
- `npm run dev` - Start Vite dev server only
- `npm run tauri:dev` - Start Tauri in dev mode (recommended)

### Building
- `npm run build` - Build frontend
- `npm run tauri:build` - Build complete application

### Linting
- `npx tsc --noEmit` - Check TypeScript types
- `cargo check` - Check Rust code (in src-tauri/)
- `cargo clippy` - Rust linting (in src-tauri/)

## Configuration

### App Data Location

The application stores data in:
- **Linux**: `~/.local/share/com.optibridge.app/`
- **macOS**: `~/Library/Application Support/com.optibridge.app/`
- **Windows**: `%APPDATA%\com.optibridge.app\`

Files stored:
- `config.json` - User settings and API keys
- `history.db` - SQLite database for upload history

## Troubleshooting

### Rust Compilation Issues

If you encounter Rust compilation errors:

1. Update Rust:
```bash
rustup update stable
```

2. Clean build artifacts:
```bash
cd src-tauri
cargo clean
cd ..
```

### Frontend Issues

1. Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

2. Clear Vite cache:
```bash
rm -rf dist node_modules/.vite
```

### Tauri Build Errors

1. Ensure all system dependencies are installed (see Prerequisites)
2. Check Tauri version compatibility
3. Review `src-tauri/tauri.conf.json` for configuration issues

## Testing Features

### Image Processing
1. Drop an image on the upload area
2. Check that it's resized (if > 1600px wide)
3. Verify WebP conversion
4. Confirm Base64 preview displays

### Clipboard
1. Copy an image to clipboard (screenshot, copy image from browser, etc.)
2. Click "Paste from Clipboard"
3. Verify image processes correctly

### Cloud Upload
1. Configure Cloudinary or R2 credentials in Settings
2. Process an image
3. Select provider and upload
4. Verify URL is returned and accessible

### History
1. Upload several images
2. Navigate to History tab
3. Verify all uploads are listed
4. Test copy and delete functions

## Adding New Features

### Adding a New Cloud Provider

1. Create uploader module in `src-tauri/src/uploaders/newprovider.rs`
2. Implement upload logic
3. Add config fields to `models.rs` Config struct
4. Update `upload_cmds.rs` to handle new provider
5. Add UI fields in `SettingsView.tsx`
6. Update provider selection in `UploadView.tsx`

### Adding New UI Components

1. Create component in `src/components/common/`
2. Follow Shadcn/UI patterns
3. Use Tailwind for styling
4. Ensure proper TypeScript types

## Performance Considerations

- Image processing happens in Rust (native speed)
- Large images are resized before upload
- WebP format reduces file size significantly
- Uploads are async and non-blocking
- History uses SQLite for efficient queries

## Security Notes

- API keys are stored in local filesystem (not encrypted by default)
- Consider implementing encryption for sensitive credentials
- Tauri's security features limit IPC surface area
- File system access is scoped via Tauri's allowlist

## Contributing

When contributing:
1. Follow existing code style
2. Add TypeScript types for all functions
3. Document Rust functions with comments
4. Test all features thoroughly
5. Update this documentation if needed

## Resources

- [Tauri Documentation](https://tauri.app/)
- [React Documentation](https://react.dev/)
- [Rust Book](https://doc.rust-lang.org/book/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)

