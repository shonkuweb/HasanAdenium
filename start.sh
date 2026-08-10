#!/bin/sh

# Ensure persistent database directory exists with full read/write permissions
mkdir -p /data 2>/dev/null || true
chmod 777 /data 2>/dev/null || true

# Copy default SQLite database if not present in /data volume
if [ ! -f /data/dev.db ]; then
  echo "Database not found in /data. Copying initial dev.db..."
  cp /app/dev.db /data/dev.db 2>/dev/null || true
fi

chmod 666 /data/dev.db 2>/dev/null || true

# Copy fallback dev.db locally in working directory
if [ ! -f ./dev.db ]; then
  cp /app/dev.db ./dev.db 2>/dev/null || true
fi
chmod 666 ./dev.db 2>/dev/null || true

# Start Next.js server
exec node server.js
