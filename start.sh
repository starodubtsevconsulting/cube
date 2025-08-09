#!/bin/bash

# Exit on error
set -e

# Stop any running instances first
./stop.sh

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Create dist directory if it doesn't exist
mkdir -p dist

# Start TypeScript compiler in watch mode in the background
echo "Starting TypeScript compiler in watch mode..."
npx tsc --watch --preserveWatchOutput &
TSC_PID=$!

# Start HTTP server
echo "Starting HTTP server on http://localhost:8080"
echo "Press Ctrl+C to stop"

# Function to clean up on exit
cleanup() {
  echo "Stopping processes..."
  kill $TSC_PID 2>/dev/null
  kill $SERVER_PID 2>/dev/null
  exit 0
}

# Set up trap to catch Ctrl+C and clean up
trap cleanup INT TERM

# Start HTTP server in the background
npx http-server -p 8080 &
SERVER_PID=$!

# Give the server a moment to start
sleep 2

# Open Chrome with the app URL
./open-chrome-browser-tabs.sh

# Wait for the server process
echo "HTTP server is running. Press Ctrl+C to stop."
wait $SERVER_PID

# If we get here, the server was stopped
cleanup
