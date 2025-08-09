#!/bin/bash

# Stop any running instances of the TypeScript compiler and HTTP server
echo "Stopping running processes..."

# Kill TypeScript compiler
pkill -f "tsc --watch" 2>/dev/null

# Kill HTTP server
pkill -f "http-server -p 8080" 2>/dev/null

echo "All services stopped."
