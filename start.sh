#!/bin/bash

# Exit on error
set -e

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fancy header
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       3D Cube Visualization Starter        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"

# Check if we should clear previous build
if [ "$1" == "--clean" ] || [ "$1" == "-c" ]; then
    echo -e "${YELLOW}Cleaning previous build...${NC}"
    rm -rf dist
else
    echo -e "${YELLOW}Tip: Use './start.sh --clean' to start with a fresh build${NC}"
fi

# Stop any running instances first
./stop.sh

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Installing dependencies...${NC}"
  npm install
fi

# Create dist directory if it doesn't exist
mkdir -p dist

# Start TypeScript compiler in watch mode in the background
echo -e "${YELLOW}Starting TypeScript compiler in watch mode...${NC}"
npx tsc --watch --preserveWatchOutput &
TSC_PID=$!

# Check if port 8080 is already in use and find an available port
PORT=8080
while [ $(lsof -i:$PORT -t >/dev/null 2>&1; echo $?) -eq 0 ]; do
  echo "Port $PORT is already in use, trying next port..."
  PORT=$((PORT + 1))
  if [ $PORT -gt 8090 ]; then
    echo "Error: Could not find an available port between 8080 and 8090."
    exit 1
  fi
done

# Start HTTP server
echo -e "${YELLOW}Starting HTTP server on http://localhost:$PORT${NC}"

# Function to clean up on exit
cleanup() {
  echo -e "\n${YELLOW}Stopping processes...${NC}"
  kill $TSC_PID 2>/dev/null
  kill $SERVER_PID 2>/dev/null
  exit 0
}

# Set up trap to catch Ctrl+C and clean up
trap cleanup INT TERM

# Start HTTP server in the background
npx http-server -p $PORT --cors -c-1 --no-cache &
SERVER_PID=$!

# Give the server a moment to start
sleep 2

# Ask if user wants to open browser automatically (default yes)
read -p "$(echo -e ${GREEN}Open browser automatically? [Y/n]: ${NC})" choice
choice=${choice:-Y}

if [[ $choice =~ ^[Yy]$ ]]; then
    # Open browser with the app URL
    PORT_ARG=$PORT ./open-chrome-browser-tabs.sh
    echo -e "${GREEN}Browser opened with the application.${NC}"
else
    echo -e "${GREEN}You can access the application at: http://localhost:$PORT/src/canvas.html${NC}"
fi

# Show instructions for interaction
echo -e "\n${BLUE}==== Cube Interaction Controls ====${NC}"
echo -e "${GREEN}• Rotate:${NC} Click and drag to rotate the cube"
echo -e "${GREEN}• Move:${NC} Hold Shift while clicking and dragging to move the cube"
echo -e "${GREEN}• Zoom:${NC} Use mouse wheel to zoom in and out"

# Wait for the server process
echo -e "\n${YELLOW}HTTP server is running. Press Ctrl+C to stop.${NC}"
wait $SERVER_PID

# If we get here, the server was stopped
cleanup
