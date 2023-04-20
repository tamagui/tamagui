#!/bin/bash

echo "unlocking"

echo "$GIT_CRYPT_KEY" | base64  -d > ./git-crypt-key

./node_modules/.bin/git-crypt unlock ./git-crypt-key

rm ./git-crypt-key
