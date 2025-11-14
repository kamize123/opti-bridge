#!/bin/bash
# Script to run frontend only with hot reload

echo "Starting frontend development server..."
echo "Make sure port 1420 is free, or it will fail"

# Kill any process using port 1420
lsof -ti:1420 | xargs kill -9 2>/dev/null || true
sleep 1

# Start Vite dev server
npm run dev

