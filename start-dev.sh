#!/bin/bash
# Script to start Tauri dev server, ensuring port 1420 is free

echo "Clearing port 1420..."
lsof -ti:1420 | xargs kill -9 2>/dev/null || true
sleep 1

echo "Starting Tauri dev server..."
npm run tauri:dev

