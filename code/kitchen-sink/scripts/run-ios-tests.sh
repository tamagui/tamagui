#!/bin/bash
# Run iOS Appium tests
# This script manages Metro bundler lifecycle and runs tests

set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KITCHEN_SINK_DIR="$(dirname "$SCRIPT_DIR")"

# Cleanup function to kill background processes
cleanup() {
  echo "=== Cleaning up background processes ==="
  if [ -n "$METRO_PID" ]; then
    echo "Killing Metro (PID: $METRO_PID)"
    kill "$METRO_PID" 2>/dev/null || true
    wait "$METRO_PID" 2>/dev/null || true
  fi
  # Kill any remaining node processes related to expo/metro
  pkill -f "expo start" 2>/dev/null || true
  pkill -f "@expo/metro-runtime" 2>/dev/null || true
  echo "Cleanup complete"
}

# Set trap to cleanup on exit (success or failure)
trap cleanup EXIT

echo "=== Starting Metro bundler ==="
cd "$KITCHEN_SINK_DIR"

# Start Metro in background
EXPO_NO_TELEMETRY=true npx expo start --dev-client --offline &
METRO_PID=$!
echo "Metro started with PID: $METRO_PID"

echo "Waiting for Metro to start..."
for i in $(seq 1 60); do
  if curl -s "http://127.0.0.1:8081/" -H "Expo-Platform: ios" > /dev/null 2>&1; then
    echo "Metro is ready!"
    break
  fi
  echo "Waiting for Metro... ($i/60)"
  sleep 2
done

# Pre-warm bundle
echo "=== Pre-warming bundle ==="
MANIFEST=$(curl -s "http://127.0.0.1:8081/" -H "Expo-Platform: ios")
BUNDLE_URL=$(echo "$MANIFEST" | jq -r '.launchAsset.url')
echo "Pre-warming bundle from: $BUNDLE_URL"
curl -s "$BUNDLE_URL" > /dev/null 2>&1 || echo "Bundle fetch completed"

# Run tests
echo "=== Running Appium tests ==="
NATIVE_TEST_PLATFORM=ios npx vitest run --config vitest.config.ios.mts
