#!/bin/bash

echo "================================================"
echo "OptiBridge Development Environment Setup"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo -e "${YELLOW}Warning: This script is designed for Linux. Adjustments may be needed for other systems.${NC}"
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js
echo "Checking Node.js..."
if command_exists node; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js is installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "  Please install Node.js v18 or higher from https://nodejs.org/"
    exit 1
fi

# Check npm
echo "Checking npm..."
if command_exists npm; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ npm is installed: $NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
fi

# Check Rust
echo "Checking Rust..."
if command_exists rustc && command_exists cargo; then
    RUST_VERSION=$(rustc --version)
    CARGO_VERSION=$(cargo --version)
    echo -e "${GREEN}✓ Rust is installed: $RUST_VERSION${NC}"
    echo -e "${GREEN}✓ Cargo is installed: $CARGO_VERSION${NC}"
else
    echo -e "${RED}✗ Rust is not installed${NC}"
    echo "  Installing Rust via rustup..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
    echo -e "${GREEN}✓ Rust installed successfully${NC}"
fi

# Check system dependencies (Linux)
echo ""
echo "Checking system dependencies..."

DEPENDENCIES=(
    "libwebkit2gtk-4.0-dev"
    "libssl-dev"
    "libgtk-3-dev"
    "libayatana-appindicator3-dev"
    "librsvg2-dev"
    "patchelf"
)

MISSING_DEPS=()

for dep in "${DEPENDENCIES[@]}"; do
    if ! dpkg -l | grep -q "^ii  $dep"; then
        MISSING_DEPS+=("$dep")
    fi
done

if [ ${#MISSING_DEPS[@]} -eq 0 ]; then
    echo -e "${GREEN}✓ All system dependencies are installed${NC}"
else
    echo -e "${YELLOW}! Missing system dependencies:${NC}"
    for dep in "${MISSING_DEPS[@]}"; do
        echo "  - $dep"
    done
    echo ""
    echo "Install them with:"
    echo "  sudo apt update"
    echo "  sudo apt install ${MISSING_DEPS[*]}"
    echo ""
    read -p "Would you like to install them now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        sudo apt update
        sudo apt install -y ${MISSING_DEPS[*]}
    else
        echo -e "${YELLOW}Warning: Application may not build without these dependencies${NC}"
    fi
fi

# Install Node dependencies
echo ""
echo "Installing Node.js dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Node dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install Node dependencies${NC}"
    exit 1
fi

# Check Tauri CLI
echo ""
echo "Checking Tauri CLI..."
if npm list @tauri-apps/cli >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Tauri CLI is available${NC}"
else
    echo -e "${YELLOW}! Tauri CLI not found in dependencies${NC}"
fi

echo ""
echo "================================================"
echo -e "${GREEN}Setup Complete!${NC}"
echo "================================================"
echo ""
echo "To start development:"
echo "  npm run tauri:dev"
echo ""
echo "To build for production:"
echo "  npm run tauri:build"
echo ""
echo "For more information, see DEVELOPMENT.md"
echo ""

