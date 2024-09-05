#!/bin/bash

app="$APP_NAME"
echo "Serving $app"

if [ "$app" = "one" ]; then
  yarn workspace @tamagui/ooo serve:railway
elif [ "$app" = "takeout" ]; then
  yarn workspace @tamagui/takeout serve:railway
else
  yarn workspace @tamagui/dot-dev serve:railway
fi
