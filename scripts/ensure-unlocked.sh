#!/bin/bash

if grep -q 'is_unlocked' ./apps/bento/src/test-encrypted-file; then
  echo "Unlocked!"
else
  echo "Not unlocked :("
  cat ./apps/bento/src/test-encrypted-file
  exit 1
fi
