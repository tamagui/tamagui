#!/bin/bash

app="$APP_NAME"
echo "Serving $app"

if [ "$app" = "takeout" ]; then
  cd code/takeout && bun run serve:railway
elif [ "$app" = "docs" ]; then
  cd code/one-docs && bun run serve:railway
else
  cd code/tamagui.dev && bun run serve:railway
fi
