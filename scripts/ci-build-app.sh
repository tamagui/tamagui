#!/bin/bash

if [ "$1" != "--app" ] || [ -z "$2" ]; then
    echo "Usage: $0 --app <app_name>"
    exit 1
fi

app="$2"
echo "Deploying app: $app"

if [ "$app" = "one" ]; then
  yarn ooo:build
else
  yarn dev:build
fi
