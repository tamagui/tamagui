#!/bin/bash

if [ "$SHOULD_UNLOCK_GIT_CRYPT" = "1" ]; then
  if grep -q 'is_unlocked' ./apps/bento/src/test-encrypted-file; then
    echo "Unlocked!"
  else
    echo "Unlocking..."
    ./scripts/transcrypt.sh -y -p "$TRANSCRYPT_PASSWORD"
  fi
else
  echo "Not unlocking"
fi
