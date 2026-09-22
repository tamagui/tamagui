#!/bin/bash

# resolve tsc from the repo so this works outside `bun run` too; a missing tsc
# used to print "command not found" and pass, since only "error" was checked
tsc="$(cd "$(dirname "$0")/.." && pwd)/node_modules/.bin/tsc"

output=$("$tsc" -b --preserveWatchOutput tsconfig.build.json "$@" 2>&1)
status=$?
echo "$output"

if [ "$status" -ne 0 ] || echo "$output" | grep -q "error"; then
  echo "‼️ Type check failed"
  exit 1
else
  echo "✅ Type check passed"
fi
