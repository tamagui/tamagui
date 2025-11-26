#!/bin/bash
# Run native Appium tests for iOS or Android
# This script manages Metro bundler lifecycle and runs tests
#
# Usage:
#   ./native-testing/run-tests.sh ios
#   ./native-testing/run-tests.sh android
#
# Environment variables:
#   NATIVE_TEST_PLATFORM - Set automatically based on argument
#   SIMULATOR_UDID - iOS simulator UUID (optional, will auto-detect)
#   IOS_TEST_CONTAINER_PATH_DEV - Path to iOS .app bundle
#   ANDROID_TEST_APK_PATH - Path to Android APK
#   ANDROID_EMULATOR_NAME - Android emulator name (optional)

set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KITCHEN_SINK_DIR="$(dirname "$SCRIPT_DIR")"

# Parse platform argument
PLATFORM="${1:-ios}"
if [[ "$PLATFORM" != "ios" && "$PLATFORM" != "android" ]]; then
  echo "Usage: $0 [ios|android]"
  echo "  ios     - Run iOS tests (default)"
  echo "  android - Run Android tests"
  exit 1
fi

export NATIVE_TEST_PLATFORM="$PLATFORM"
echo "=== Running $PLATFORM native tests ==="

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

# Android-specific setup
if [ "$PLATFORM" = "android" ]; then
  echo "=== Checking ADB devices ==="
  adb devices -l || true

  if [ -n "$ANDROID_TEST_APK_PATH" ]; then
    echo "=== Checking APK ==="
    ls -la "$ANDROID_TEST_APK_PATH" || echo "Warning: APK not found at $ANDROID_TEST_APK_PATH"
  fi
fi

echo "=== Starting Metro bundler ==="
cd "$KITCHEN_SINK_DIR"

# Start Metro in background
EXPO_NO_TELEMETRY=true npx expo start --dev-client --offline &
METRO_PID=$!
echo "Metro started with PID: $METRO_PID"

echo "Waiting for Metro to start..."
for i in $(seq 1 60); do
  if curl -s "http://127.0.0.1:8081/" -H "Expo-Platform: $PLATFORM" > /dev/null 2>&1; then
    echo "Metro is ready!"
    break
  fi
  echo "Waiting for Metro... ($i/60)"
  sleep 2
done

# Pre-warm bundle
echo "=== Pre-warming bundle ==="
MANIFEST=$(curl -s "http://127.0.0.1:8081/" -H "Expo-Platform: $PLATFORM")
BUNDLE_URL=$(echo "$MANIFEST" | jq -r '.launchAsset.url')
echo "Pre-warming bundle from: $BUNDLE_URL"
curl -s "$BUNDLE_URL" > /dev/null 2>&1 || echo "Bundle fetch completed"

# Run tests
echo "=== Running Appium tests ==="
npx vitest run --config native-testing/vitest.config.ts
