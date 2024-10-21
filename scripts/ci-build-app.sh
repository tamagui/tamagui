#!/bin/bash

app="$APP_NAME"
echo "Building $app"

if [ "$app" = "one" ]; then
  yarn ooo:build
elif [ "$app" = "takeout" ]; then
  yarn takeout:build
elif [ "$app" = "docs" ]; then
  yarn docs:build
else
  yarn dev:build
fi
