#!/bin/bash

app="$APP_NAME"
echo "Serving $app"

if [ "$app" = "takeout" ]; then
  bun run workspace @tamagui/takeout serve:railway
elif [ "$app" = "docs" ]; then
  bun run workspace @tamagui/one-docs serve:railway
else
  bun run workspace @tamagui/dot-dev serve:railway
fi
