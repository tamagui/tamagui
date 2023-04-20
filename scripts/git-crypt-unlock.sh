#!/bin/bash

if [[ $(file -b --mime-type apps/site/app/layout.tsx) == "text/html" ]]; then
  echo "Already unlocked."
else
  echo "Unlocking..."
  echo "$GIT_CRYPT_KEY" | base64  -d > ./git-crypt-key
  ./node_modules/.bin/git-crypt unlock ./git-crypt-key
  rm ./git-crypt-key
fi
