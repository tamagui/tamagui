#!/bin/bash

output=$(tsc -b --preserveWatchOutput tsconfig.build.json "$@" 2>&1)
status=$?
echo "$output"

# trust tsc's exit code: grepping for "error" also missed a missing binary
if [ $status -ne 0 ]; then
  echo "‼️ Type check failed"
  exit 1
else
  echo "✅ Type check passed"
fi
