#!/bin/bash

echo "Unlocking..."
echo "$GIT_CRYPT_KEY" | base64  -d > ./git-crypt-key
./node_modules/.bin/git-crypt-bin unlock ./git-crypt-key
rm ./git-crypt-key
