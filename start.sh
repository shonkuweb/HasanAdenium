#!/bin/sh

# Ensure persistent database directory exists
mkdir -p /data 2>/dev/null || true

# Copy default SQLite database if not present in /data volume
if [ ! -f /data/dev.db ]; then
  echo "Database not found in /data. Copying initial dev.db..."
  cp /app/dev.db /data/dev.db 2>/dev/null || true
else
  echo "Persistent database found in /data. Proceeding..."
fi

# Start Next.js server
exec node server.js
