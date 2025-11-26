#!/bin/bash
# Run Android Appium tests
# This script is called from CI after the emulator is booted

set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KITCHEN_SINK_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== Emulator booted, checking ADB devices ==="
adb devices -l

echo "=== Starting Metro bundler ==="
cd "$KITCHEN_SINK_DIR"

# Start Metro in background
EXPO_NO_TELEMETRY=true npx expo start --dev-client --offline &
METRO_PID=$!
echo "Metro started with PID: $METRO_PID"

echo "Waiting for Metro to start..."
for i in $(seq 1 60); do
  if curl -s "http://127.0.0.1:8081/" -H "Expo-Platform: android" > /dev/null 2>&1; then
    echo "Metro is ready!"
    break
  fi
  echo "Waiting for Metro... ($i/60)"
  sleep 2
done

# Pre-warm bundle
echo "=== Pre-warming bundle ==="
MANIFEST=$(curl -s "http://127.0.0.1:8081/" -H "Expo-Platform: android")
BUNDLE_URL=$(echo "$MANIFEST" | jq -r '.launchAsset.url')
echo "Pre-warming bundle from: $BUNDLE_URL"
curl -s "$BUNDLE_URL" > /dev/null 2>&1 || echo "Bundle fetch completed"

# Verify APK exists
echo "=== Checking APK ==="
ls -la "$ANDROID_TEST_APK_PATH"

# Run tests
echo "=== Running Appium tests ==="
NATIVE_TEST_PLATFORM=android npx vitest run --config vitest.config.android.mts
