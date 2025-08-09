#!/bin/bash

# Open Chrome with the app URL
# If Chrome is already running, open in a new tab, otherwise start Chrome

# URL of your application
APP_URL="http://localhost:8080/src/canvas.html"

# Function to check if Chrome is running
is_chrome_running() {
  if pgrep -x "chrome" > /dev/null || pgrep -x "google-chrome" > /dev/null || pgrep -x "Google Chrome" > /dev/null; then
    return 0  # Chrome is running
  else
    return 1  # Chrome is not running
  fi
}

# Open URL in Chrome
if is_chrome_running; then
  # Chrome is already running, open in a new tab
  xdg-open "$APP_URL" 2>/dev/null || \
  open -a "Google Chrome" "$APP_URL" 2>/dev/null || \
  start chrome "$APP_URL" 2>/dev/null || \
  echo "Could not detect Chrome. Please open $APP_URL manually"
else
  # Chrome is not running, start it with the URL
  google-chrome "$APP_URL" 2>/dev/null || \
  open -a "Google Chrome" "$APP_URL" 2>/dev/null || \
  start chrome "$APP_URL" 2>/dev/null || \
  echo "Could not start Chrome. Please open $APP_URL manually"
fi
