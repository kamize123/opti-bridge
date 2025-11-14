#!/bin/bash
# Script to create symlinks for WebKit 4.0 -> 4.1 compatibility

echo "Creating symlinks for WebKit 4.0 -> 4.1..."

# Create symlinks for WebKit 4.0 pointing to 4.1
sudo ln -sf /usr/lib/x86_64-linux-gnu/libwebkit2gtk-4.1.so.0 /usr/lib/x86_64-linux-gnu/libwebkit2gtk-4.0.so.0
sudo ln -sf /usr/lib/x86_64-linux-gnu/libwebkit2gtk-4.1.so /usr/lib/x86_64-linux-gnu/libwebkit2gtk-4.0.so

# Create symlinks for JavaScriptCore 4.0 pointing to 4.1
sudo ln -sf /usr/lib/x86_64-linux-gnu/libjavascriptcoregtk-4.1.so.0 /usr/lib/x86_64-linux-gnu/libjavascriptcoregtk-4.0.so.0
sudo ln -sf /usr/lib/x86_64-linux-gnu/libjavascriptcoregtk-4.1.so /usr/lib/x86_64-linux-gnu/libjavascriptcoregtk-4.0.so

echo "Symlinks created successfully!"
echo "You can now run: npm run tauri:dev"

