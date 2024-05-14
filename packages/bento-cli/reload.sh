#!/bin/bash

# Function to run the CLI command
run_command() {
    # Add your CLI command here
    echo "Running npm run dev..."
    # Example: node index.js
    bento-cli-test
}

# Initial run of the CLI command
run_command &

# Watch for changes using fswatch
while true; do
    # Monitor for changes in the directory
    if fswatch -1 ./ ; then
        # When changes are detected, close the previous command
        echo "Changes detected, restarting the command..."
        pkill -f "bento-cli-test"
        # Run the CLI command again in the background
        run_command &
    fi
done
