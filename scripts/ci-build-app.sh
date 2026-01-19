#!/bin/bash

app="$APP_NAME"
echo "Building $app"

if [ "$app" = "takeout" ]; then
  bun run takeout:build
elif [ "$app" = "docs" ]; then
  bun run docs:build
else
  # Use cd instead of --filter to avoid bun ENOENT issues in Docker
  cd code/tamagui.dev && bun run build:prod
fi
