#!/bin/sh

args="$@"

if command -v bun >/dev/null 2>&1; then
  bun run --filter '*' $args
else
  turbo run build --no-cache --force -- $args
fi
