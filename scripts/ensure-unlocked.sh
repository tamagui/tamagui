#!/bin/bash

if grep -q 'is_unlocked' ./code/bento/src/test-encrypted-file; then
  echo "Unlocked!"
else
  echo "🚨🚨🚨\n\n\n Not unlocked - proceeding\n\n\n"
fi
