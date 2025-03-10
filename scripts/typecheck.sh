#!/bin/bash

output=$(tsc -b --preserveWatchOutput tsconfig.build.json "$@" 2>&1)
echo "$output"

if echo "$output" | grep -q "error"; then
  echo "‼️ Type check failed"
  exit 1
else
  echo "✅ Type check passed"
fi
