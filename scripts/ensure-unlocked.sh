#!/bin/bash

check_file="./apps/bento/src/index.ts"
file_type=$(file "$check_file")

if echo "$file_type" | grep -qE 'encrypted|data'; then
  echo "error, repo not unencrypted"
  exit 1
else
  echo "repo unlocked"
fi
