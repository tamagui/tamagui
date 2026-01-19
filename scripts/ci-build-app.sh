#!/bin/bash

app="$APP_NAME"
echo "Building $app"

if [ "$app" = "takeout" ]; then
  bun run takeout:build
elif [ "$app" = "docs" ]; then
  bun run docs:build
else
  # Run from root directory to maintain proper module resolution
  bun run dev:build
fi
