#!/bin/bash

echo "should? $SHOULD_UNLOCK_GIT_CRYPT"

if [ "$SHOULD_UNLOCK_GIT_CRYPT" = "1" ]; then
  echo "Unlocking..."
  echo "$GIT_CRYPT_KEY" | base64  -d > ./git-crypt-key
  ./node_modules/.bin/git-crypt-bin unlock ./git-crypt-key
  rm ./git-crypt-key
fi

