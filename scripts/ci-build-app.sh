#!/bin/bash

app="$APP_NAME"
echo "Building $app"

if [ "$app" = "takeout" ]; then
  bun run takeout:build
elif [ "$app" = "docs" ]; then
  bun run docs:build
else
  bun run dev:build
fi
