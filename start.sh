#!/bin/bash

# Exit on error
set -e

rm -rf dist

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
echo "Starting HTTP server on http://localhost:$PORT"
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
npx http-server -p $PORT --cors -c-1 --no-cache &
SERVER_PID=$!

# Give the server a moment to start
sleep 2

# Open Chrome with the app URL
PORT_ARG=$PORT ./open-chrome-browser-tabs.sh

# Wait for the server process
echo "HTTP server is running. Press Ctrl+C to stop."
wait $SERVER_PID

# If we get here, the server was stopped
cleanup
