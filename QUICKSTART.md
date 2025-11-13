# Quick Start Guide

## First Time Setup

### 1. Install Prerequisites

**Install Rust:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

**Install System Dependencies (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install -y \
    libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    patchelf
```

### 2. Run Setup Script

```bash
./setup.sh
```

Or manually:
```bash
npm install
```

### 3. Start Development

```bash
npm run tauri:dev
```

## Initial Configuration

1. **Open the Settings tab** in the application
2. **Configure Cloud Provider(s)**:

### For Cloudinary:
- Sign up at [cloudinary.com](https://cloudinary.com)
- Get your credentials from the Dashboard
- Enter:
  - Cloud Name
  - API Key
  - API Secret

### For Cloudflare R2:
- Create an R2 bucket in Cloudflare Dashboard
- Generate API tokens
- Enter:
  - Access Key ID
  - Secret Access Key
  - Bucket Name
  - Endpoint (e.g., `https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com`)
  - Public Domain (your custom domain or R2 public URL)

3. **Click "Save Settings"**

## Using OptiBridge

### Upload an Image

**Method 1: Drag & Drop**
1. Go to the Upload tab
2. Drag an image file onto the dropzone
3. Wait for processing (resize + WebP conversion)
4. Select provider (Cloudinary or R2)
5. Click "Upload to Cloud"
6. Copy the returned URL

**Method 2: File Picker**
1. Click "Choose File"
2. Select an image from your computer
3. Follow steps 3-6 above

**Method 3: Clipboard**
1. Copy an image to clipboard (screenshot, copy from browser, etc.)
2. Click "Paste from Clipboard"
3. Follow steps 3-6 above

### View Upload History

1. Go to the History tab
2. See all previously uploaded images
3. Click "Copy" to copy the URL
4. Click trash icon to delete from history

### Manage Settings

1. Go to the Settings tab
2. Update any configuration
3. Adjust:
   - Max Width (default: 1600px)
   - Auto WebP conversion (default: enabled)
4. Click "Save Settings"

## Tips & Tricks

### Keyboard Shortcuts
- The app is keyboard-friendly
- Use Tab to navigate between fields
- Press Enter to submit forms

### Image Optimization
- Images wider than Max Width are automatically resized
- All images are converted to WebP for optimal file size
- Original aspect ratio is preserved

### URL Management
- URLs are automatically copied to clipboard (if enabled in settings)
- History persists across app restarts
- Delete unwanted history items anytime

### Troubleshooting

**Image won't process:**
- Check file format (supported: PNG, JPG, JPEG, WebP, GIF)
- Ensure file is not corrupted
- Check console for errors (in dev mode)

**Upload fails:**
- Verify API credentials in Settings
- Check internet connection
- Ensure cloud provider account is active

**App won't start:**
- Run `npm run tauri:dev` from terminal to see errors
- Check that all dependencies are installed
- Try `cargo clean` in `src-tauri/` folder

## Development Workflow

### Hot Reload
- Frontend changes reload automatically
- Rust changes require app restart

### Viewing Logs
- Frontend logs: Open DevTools (F12 in dev mode)
- Rust logs: Check terminal where you ran `npm run tauri:dev`

### Testing Changes
1. Make changes to code
2. App reloads automatically (frontend) or restart (backend)
3. Test the affected features
4. Check for errors in console/terminal

## Building for Distribution

```bash
npm run tauri:build
```

The built application will be in:
- `src-tauri/target/release/`
- Platform-specific installers in `src-tauri/target/release/bundle/`

## Next Steps

- Read [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed development guide
- Check [README.md](./README.md) for project overview
- Explore the codebase and customize for your needs

## Getting Help

If you encounter issues:
1. Check the logs (terminal and DevTools console)
2. Review [DEVELOPMENT.md](./DEVELOPMENT.md) troubleshooting section
3. Ensure all prerequisites are installed
4. Try a clean rebuild: `rm -rf node_modules src-tauri/target && npm install`

## What's Next?

Once you're comfortable with the basics:
- Add custom image filters
- Integrate additional cloud providers
- Customize the UI theme
- Add batch upload support
- Implement image annotations
- Create custom keyboard shortcuts

Happy uploading! 🚀

