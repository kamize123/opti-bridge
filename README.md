# OptiBridge

High-performance desktop image uploader for technical bloggers.

## Features

- **Multiple Input Methods**: Drag & drop, file picker, or paste from clipboard
- **Image Optimization**: Automatic resizing and WebP conversion
- **Cloud Upload**: Support for Cloudinary and Cloudflare R2
- **Upload History**: Track all your uploaded images
- **Modern UI**: Clean, minimalist interface with Tailwind CSS and Shadcn UI

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Rust + Tauri
- **UI**: TailwindCSS + Shadcn/UI
- **State Management**: Zustand
- **Storage**: SQLite for history

## Installation

### Prerequisites

- Node.js (v18 or higher)
- Rust (latest stable)
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Run in development mode:
```bash
npm run tauri:dev
```

3. Build for production:
```bash
npm run tauri:build
```

## Configuration

Configure your cloud providers in the Settings tab:

### Cloudinary
- Cloud Name
- API Key
- API Secret

### Cloudflare R2
- Access Key ID
- Secret Access Key
- Bucket Name
- Endpoint URL
- Public Domain

## Usage

1. **Upload Image**:
   - Drag and drop an image onto the upload area
   - Click "Choose File" to select from your computer
   - Click "Paste from Clipboard" to use an image from clipboard

2. **Process & Upload**:
   - Image is automatically optimized (resized and converted to WebP)
   - Select your preferred cloud provider (Cloudinary or R2)
   - Click "Upload to Cloud"

3. **Copy URL**:
   - Once uploaded, copy the public URL with one click
   - URL is ready to paste into your blog posts

4. **View History**:
   - Access all your previously uploaded images
   - Copy URLs or delete items as needed

## Project Structure

```
opti-bridge/
├── src/                  # React frontend
│   ├── components/       # UI components
│   ├── hooks/           # React hooks
│   ├── lib/             # Utilities
│   ├── pages/           # Main views
│   ├── state/           # Zustand store
│   └── styles/          # CSS files
├── src-tauri/           # Rust backend
│   ├── src/
│   │   ├── commands/    # Tauri commands
│   │   ├── modules/     # Core logic
│   │   ├── uploaders/   # Cloud providers
│   │   └── main.rs      # Entry point
│   └── Cargo.toml       # Rust dependencies
└── package.json         # Node dependencies
```

## License

MIT

