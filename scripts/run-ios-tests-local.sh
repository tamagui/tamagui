#!/bin/bash

# Script to run iOS tests locally
set -e

echo "🏃 Running iOS tests locally..."

# Check if Appium is installed
if ! command -v appium &> /dev/null; then
    echo "📦 Installing Appium globally..."
    npm install -g appium
fi

# Check if xcuitest driver is installed
if appium driver list --installed 2>/dev/null | grep -q xcuitest; then
    echo "✅ xcuitest driver is already installed"
else
    echo "📦 Installing xcuitest driver..."
    appium driver install xcuitest || true
fi

# Check if Appium is running
if ! lsof -i :4723 &> /dev/null; then
    echo "🚀 Starting Appium server..."
    appium > /tmp/appium.log 2>&1 &
    APPIUM_PID=$!
    sleep 3
    echo "Appium started with PID $APPIUM_PID"
else
    echo "✅ Appium is already running on port 4723"
fi

# Find available simulator
echo "🔍 Finding available iOS simulator..."
SIMULATOR_INFO=$(xcrun simctl list --json devices | jq -r '
    [.devices | to_entries[] | 
     select(.key | contains("SimRuntime.iOS")) | 
     .key as $runtime | 
     .value[] | 
     select(.state == "Booted" or .state == "Shutdown") |
     select(.name | contains("iPhone")) |
     { runtime: $runtime, name: .name, udid: .udid, state: .state }
    ] | first'
)

if [ -z "$SIMULATOR_INFO" ] || [ "$SIMULATOR_INFO" = "null" ]; then
    echo "❌ No iPhone simulator found. Please create one in Xcode."
    exit 1
fi

SIMULATOR_UDID=$(echo "$SIMULATOR_INFO" | jq -r '.udid')
SIMULATOR_NAME=$(echo "$SIMULATOR_INFO" | jq -r '.name')
SIMULATOR_STATE=$(echo "$SIMULATOR_INFO" | jq -r '.state')

echo "📱 Found simulator: $SIMULATOR_NAME (UDID: $SIMULATOR_UDID, State: $SIMULATOR_STATE)"

# Boot simulator if needed
if [ "$SIMULATOR_STATE" != "Booted" ]; then
    echo "🔌 Booting simulator..."
    xcrun simctl boot "$SIMULATOR_UDID"
    sleep 5
fi

# Check if the iOS app is built
APP_PATH=""
if [ -d "code/kitchen-sink/ios/build/Build/Products/Debug-iphonesimulator/tamaguikitchensink.app" ]; then
    APP_PATH="code/kitchen-sink/ios/build/Build/Products/Debug-iphonesimulator/tamaguikitchensink.app"
elif [ -d "code/kitchen-sink/ios/DerivedData/Build/Products/Debug-iphonesimulator/tamaguikitchensink.app" ]; then
    APP_PATH="code/kitchen-sink/ios/DerivedData/Build/Products/Debug-iphonesimulator/tamaguikitchensink.app"
fi

if [ -z "$APP_PATH" ] || [ ! -d "$APP_PATH" ]; then
    echo "⚠️  iOS app not found. Building the app..."
    echo "This might take a while on first run..."
    
    cd code/kitchen-sink
    
    # Prebuild if needed
    if [ ! -d "ios" ]; then
        echo "📦 Running expo prebuild..."
        npx expo prebuild --platform ios
    fi
    
    # Build the app
    echo "🔨 Building iOS app..."
    cd ios
    xcodebuild -workspace tamaguikitchensink.xcworkspace \
               -scheme tamaguikitchensink \
               -configuration Debug \
               -destination "id=$SIMULATOR_UDID" \
               -derivedDataPath ./DerivedData \
               build
    cd ../../..
    
    APP_PATH="code/kitchen-sink/ios/DerivedData/Build/Products/Debug-iphonesimulator/tamaguikitchensink.app"
fi

echo "✅ Using app at: $APP_PATH"

# Export environment variables
export SIMULATOR_UDID="$SIMULATOR_UDID"
export IOS_TEST_CONTAINER_PATH_DEV="$(pwd)/$APP_PATH"

# Run the tests
echo "🧪 Running tests..."
yarn test-ios

# Cleanup
if [ ! -z "$APPIUM_PID" ]; then
    echo "🧹 Stopping Appium server..."
    kill $APPIUM_PID 2>/dev/null || true
fi

echo "✨ Done!"