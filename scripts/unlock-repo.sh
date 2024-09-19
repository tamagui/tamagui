#!/bin/bash

if [ "$SHOULD_UNLOCK_GIT_CRYPT" = "1" ]; then
  if grep -q 'is_unlocked' ./code/bento/src/test-encrypted-file; then
    echo "Unlocked!"
  else
    echo "Unlocking..."
    
    ./scripts/transcrypt.sh -y -p "$TRANSCRYPT_PASSWORD"
    ./scripts/ensure-unlocked.sh

    # Check if the repo is dirty (has uncommitted changes)
    if [[ -n $(git status -s) ]]; then
      echo "Repository has uncommitted changes."
      
      # Check if CI variable is set to true
      if [ "$CI" = "true" ]; then
        echo "CI environment detected. Creating commit..."
        
        # Stage all changes
        git add -A

        # Create a commit with a message indicating it was made in CI
        git commit -m "Automated commit created in CI environment [skip ci]"
        
        echo "Commit created successfully."
      else
        echo "Not in CI environment. Skipping commit creation."
      fi
    else
      echo "Repository is clean. No changes to commit."
    fi
  fi
else
  echo "Not unlocking"
fi
