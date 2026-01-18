#!/bin/bash
# Run Detox tests, starting Metro if not already running

CONFIG="${1:-ios.sim.debug}"

# Check if Metro is running on port 8081
if ! curl -s http://localhost:8081/status > /dev/null 2>&1; then
  echo "Metro not running, starting it..."
  yarn expo start --dev-client --offline &
  METRO_PID=$!

  # Wait for Metro to be ready
  echo "Waiting for Metro..."
  for i in {1..60}; do
    if curl -s http://localhost:8081/status > /dev/null 2>&1; then
      echo "Metro is ready!"
      break
    fi
    sleep 1
  done

  STARTED_METRO=true
else
  echo "Metro already running"
  STARTED_METRO=false
fi

# Run Detox
detox test -c "$CONFIG"
EXIT_CODE=$?

# Kill Metro if we started it
if [ "$STARTED_METRO" = true ] && [ -n "$METRO_PID" ]; then
  echo "Stopping Metro..."
  kill $METRO_PID 2>/dev/null
  pkill -P $METRO_PID 2>/dev/null
fi

exit $EXIT_CODE
