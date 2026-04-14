#!/bin/bash
#
# run-detox.sh - Complete Detox E2E test runner
#
# Usage:
#   bun run detox:run:ios                     # run all iOS tests
#   bun run detox:run:ios "Sheet"             # run tests matching "Sheet"
#   bun run detox:run:android                 # run all Android tests
#   bun run detox:run:android "Select"        # run tests matching "Select"
#
# This script handles the full workflow:
#   1. Checks if pods need installing (iOS only)
#   2. Detects if app needs rebuilding (compares sources vs binary)
#   3. Builds if needed
#   4. Starts Metro if not running
#   5. Runs Detox tests
#   6. Cleans up Metro if we started it
#
# Environment variables:
#   FORCE_BUILD=1       - Force rebuild even if app exists
#   SKIP_BUILD=1        - Skip build check entirely
#   SKIP_METRO=1        - Don't start Metro (assume it's running)
#   DETOX_DEVICE=name   - iOS simulator device type (default: iPhone 15)
#   DETOX_METRO_PORT=n  - Metro port reserved for Detox (default: 8082 on iOS, 8081 on Android)
#

set -e

PLATFORM="${1:-ios}"  # ios or android
DEFAULT_DETOX_METRO_PORT=8082
if [ "$PLATFORM" = "android" ]; then
  # Expo dev-client on Android expects the default Metro port unless the app is explicitly told otherwise.
  DEFAULT_DETOX_METRO_PORT=8081
fi
export DETOX_METRO_PORT="${DETOX_METRO_PORT:-$DEFAULT_DETOX_METRO_PORT}"

detect_android_sdk() {
  if [ -n "$ANDROID_SDK_ROOT" ] && [ -d "$ANDROID_SDK_ROOT" ]; then
    return
  fi

  for candidate in \
    "$HOME/Library/Android/sdk" \
    "$HOME/Android/Sdk"
  do
    if [ -d "$candidate" ]; then
      export ANDROID_SDK_ROOT="$candidate"
      export ANDROID_HOME="$candidate"
      return
    fi
  done
}

# --- Prerequisites check ---
check_prerequisites() {
  local missing=false

  if [ "$PLATFORM" = "android" ]; then
    detect_android_sdk
  fi

  if ! command -v detox &> /dev/null; then
    echo "detox-cli not found. Install with: npm install -g detox-cli"
    missing=true
  fi

  if [ "$PLATFORM" = "ios" ] && ! command -v applesimutils &> /dev/null; then
    echo "applesimutils not found. Install with: brew tap wix/brew && brew install applesimutils"
    missing=true
  fi

  if [ "$PLATFORM" = "android" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
    echo "ANDROID_SDK_ROOT is not set and no local Android SDK was found"
    missing=true
  fi

  if [ "$missing" = true ]; then
    echo ""
    echo "Install missing dependencies and try again."
    exit 1
  fi

  # Detox framework cache (needed after Xcode updates)
  if [ "$PLATFORM" = "ios" ] && [ ! -d "$HOME/Library/Detox/ios/framework" ]; then
    echo "Detox framework cache not found. Building..."
    npx detox clean-framework-cache && npx detox build-framework-cache
    echo ""
  fi

  # iOS directory (expo prebuild)
  if [ "$PLATFORM" = "ios" ] && [ ! -d "ios" ]; then
    echo "No ios/ directory found. Running expo prebuild..."
    npx expo prebuild --platform ios
    echo ""
  fi
}
TEST_FILTER="${2:-}"  # optional test name filter

CONFIG=""
APP_PATH=""
BUILD_CMD=""

case "$PLATFORM" in
  ios)
    CONFIG="ios.sim.debug"
    APP_PATH="ios/build/Build/Products/Debug-iphonesimulator/tamaguikitchensink.app"
    BUILD_CMD="bun run detox:build:ios"
    ;;
  android)
    CONFIG="android.emu.debug"
    APP_PATH="android/app/build/outputs/apk/debug/app-debug.apk"
    BUILD_CMD="bun run detox:build:android"
    ;;
  *)
    echo "Unknown platform: $PLATFORM"
    echo "Usage: $0 [ios|android] [test-filter]"
    exit 1
    ;;
esac

METRO_PID=""
STARTED_METRO=false

cleanup() {
  if [ "$STARTED_METRO" = true ] && [ -n "$METRO_PID" ]; then
    echo ""
    echo "=== Cleanup: Stopping Metro (PID: $METRO_PID) ==="
    kill "$METRO_PID" 2>/dev/null || true
    # also kill child processes
    pkill -P "$METRO_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

is_metro_running() {
  curl -s "http://localhost:${DETOX_METRO_PORT}/status" > /dev/null 2>&1
}

DID_BUILD=false

needs_rebuild() {
  # if app doesn't exist, needs build
  if [ ! -e "$APP_PATH" ]; then
    echo "App not found at $APP_PATH"
    return 0
  fi

  # if FORCE_BUILD is set, needs build
  if [ "$FORCE_BUILD" = "1" ]; then
    echo "FORCE_BUILD=1 set"
    return 0
  fi

  # check if Podfile.lock is newer than app (pods changed)
  if [ "$PLATFORM" = "ios" ]; then
    if [ "ios/Podfile.lock" -nt "$APP_PATH" ]; then
      echo "Podfile.lock is newer than app"
      return 0
    fi
  fi

  # check if package.json is newer (deps changed)
  if [ "package.json" -nt "$APP_PATH" ]; then
    echo "package.json is newer than app"
    return 0
  fi

  return 1
}

echo "========================================"
echo "  Detox Test Runner"
echo "========================================"
echo "Platform:    $PLATFORM"
echo "Config:      $CONFIG"
echo "Device:      ${DETOX_DEVICE:-iPhone 15}"
echo "Metro port:  $DETOX_METRO_PORT"
if [ "$PLATFORM" = "android" ]; then
  echo "Android SDK: ${ANDROID_SDK_ROOT:-<unset>}"
fi
echo "Test filter: ${TEST_FILTER:-<all tests>}"
echo ""

# step 0: check prerequisites
echo "=== Step 0: Checking prerequisites ==="
check_prerequisites
echo ""

# step 1: check if build needed
if [ "$SKIP_BUILD" != "1" ]; then
  echo "=== Step 1: Checking if build needed ==="
  if needs_rebuild; then
    echo "Building app..."
    $BUILD_CMD
    DID_BUILD=true
  else
    echo "App is up to date, skipping build"
  fi
  echo ""
fi

# step 2: start metro if needed
if [ "$SKIP_METRO" != "1" ]; then
  echo "=== Step 2: Metro bundler ==="
  if is_metro_running; then
    echo "Metro already running on port $DETOX_METRO_PORT"
  else
    echo "Starting Metro on port $DETOX_METRO_PORT..."
    EXPO_NO_TELEMETRY=true npx expo start --dev-client --offline --port "$DETOX_METRO_PORT" > /tmp/metro-detox.log 2>&1 &
    METRO_PID=$!
    STARTED_METRO=true

    # wait for metro to be ready (up to 60s)
    echo -n "Waiting for Metro to start"
    for i in {1..60}; do
      if is_metro_running; then
        echo " ready!"
        break
      fi
      echo -n "."
      sleep 1
    done

    if ! is_metro_running; then
      echo " FAILED"
      echo "Metro failed to start. Check /tmp/metro-detox.log:"
      tail -20 /tmp/metro-detox.log
      exit 1
    fi
  fi
  echo ""
fi

# step 3: run detox tests
echo "=== Step 3: Running Detox tests ==="

# use --reuse only if we didn't build (to reinstall after build)
if [ "$DID_BUILD" = true ]; then
  echo "Fresh build detected, will reinstall app on simulator"
  DETOX_ARGS="-c $CONFIG --maxWorkers 1"
else
  DETOX_ARGS="-c $CONFIG --reuse --maxWorkers 1"
fi

# add headless flag if requested
if [ "$HEADLESS" = "1" ]; then
  DETOX_ARGS="$DETOX_ARGS --headless"
fi

if [ -n "$TEST_FILTER" ]; then
  DETOX_ARGS="$DETOX_ARGS -t \"$TEST_FILTER\""
fi

# run with eval to handle quoted test filter
eval "npx detox test $DETOX_ARGS"
EXIT_CODE=$?

echo ""
echo "========================================"
if [ $EXIT_CODE -eq 0 ]; then
  echo "  Tests passed!"
else
  echo "  Tests failed (exit code: $EXIT_CODE)"
fi
echo "========================================"

exit $EXIT_CODE
