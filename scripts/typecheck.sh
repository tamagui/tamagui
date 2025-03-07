#!/bin/bash

tsc -b --preserveWatchOutput tsconfig.build.json "$@" 2>&1 | tee /dev/stderr | grep -q "error"

if [ $? -eq 0 ]; then
  echo "‼️ Type check failed"
  exit 1
else
  echo "✅ Type check passed"
fi
