#!/bin/bash

# Check if STARTER_FREE_DIR environment variable is set
if [ -n "$STARTER_FREE_DIR" ]; then
  echo "STARTER_FREE_DIR is set. Running tests in $STARTER_FREE_DIR"

  # Change to the STARTER_FREE_DIR directory
  cd "$STARTER_FREE_DIR" || exit 1

  # Run yarn test
  yarn test
else
  echo "STARTER_FREE_DIR is not set. Skipping tests."
fi
