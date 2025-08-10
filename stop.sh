#!/bin/bash

# Stop any running instances of the TypeScript compiler and HTTP server
echo "Stopping running processes..."

# Kill TypeScript compiler
pkill -f "tsc --watch" 2>/dev/null || true

# Kill HTTP server
pkill -f "http-server -p 8080" 2>/dev/null || true

# More aggressively find and kill any process using port 8080
echo "Ensuring port 8080 is free..."
if command -v lsof >/dev/null 2>&1; then
  PORT_PID=$(lsof -t -i:8080 2>/dev/null)
  if [ ! -z "$PORT_PID" ]; then
    echo "Found process $PORT_PID using port 8080, killing it..."
    kill -9 $PORT_PID 2>/dev/null || true
  fi
else
  echo "lsof not found, using alternative method..."
  # Alternative method using netstat and grep
  if command -v netstat >/dev/null 2>&1; then
    NETSTAT_OUTPUT=$(netstat -tunlp 2>/dev/null | grep ":8080 " || true)
    if [ ! -z "$NETSTAT_OUTPUT" ]; then
      PID_COLUMN=$(echo "$NETSTAT_OUTPUT" | awk '{print $7}' | cut -d'/' -f1)
      if [ ! -z "$PID_COLUMN" ]; then
        echo "Found process $PID_COLUMN using port 8080, killing it..."
        kill -9 $PID_COLUMN 2>/dev/null || true
      fi
    fi
  fi
fi

echo "All services stopped."
