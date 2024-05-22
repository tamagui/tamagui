#!/bin/bash

if [ "$SHOULD_UNLOCK_GIT_CRYPT" = "1" ]; then
  echo "Unlocking..."
  ./scripts/transcrypt.sh -p "$TRANSCRYPT_PASSWORD"
fi

