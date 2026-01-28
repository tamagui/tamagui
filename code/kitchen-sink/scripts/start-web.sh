#!/bin/bash
# Start webpack dev server with automatic port detection
# Writes port to .port file so playwright can read it
# Respects PORT env var, falls back to finding an available port starting at 9100

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

# find an available port and write to .port file
AVAILABLE_PORT=$(node scripts/get-port.js --find)

echo "Starting webpack dev server on port $AVAILABLE_PORT"
export PORT="$AVAILABLE_PORT"
exec npx webpack serve
