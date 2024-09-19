#!/bin/bash

if [ "$SHOULD_UNLOCK_GIT_CRYPT" = "1" ]; then
  if grep -q 'is_unlocked' ./code/bento/src/test-encrypted-file; then
    echo "Unlocked!"
  else
    echo "Unlocking..."
    # Check if the repo is dirty (has uncommitted changes)
    if [[ -n $(git status -s) ]]; then
      echo "Repository has uncommitted changes."

      # Check if CI variable is set to true
      if [ "$CI" = "true" ]; then
        echo "CI environment detected. Creating commit..."
        git config --global user.email "ci@tamagui.dev"
        git config --global user.name "CI Bot"

        # Stage all changes
        git add -A

        # Create a commit with a message indicating it was made in CI, using a generic author
        if git commit -m "Automated commit created in CI environment [skip ci]"; then
          echo "Commit created successfully."
        else
          echo "Failed to create commit."
          exit 1
        fi
      else
        echo "Not in CI environment. Skipping commit creation."
      fi
    else
      echo "Repository is clean. No changes to commit."
    fi
    ./scripts/transcrypt.sh -y -p "$TRANSCRYPT_PASSWORD"
    ./scripts/ensure-unlocked.sh
  fi
else
  echo "Not unlocking"
fi
