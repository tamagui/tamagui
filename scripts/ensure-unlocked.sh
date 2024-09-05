#!/bin/bash

if grep -q 'is_unlocked' ./code/bento/src/test-encrypted-file; then
  echo "Unlocked!"
else
  echo "Not unlocked :("
  cat ./code/bento/src/test-encrypted-file
  exit 1
fi
