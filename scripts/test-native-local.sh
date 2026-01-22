#!/bin/bash
set -e

# Simple script to run Maestro tests locally
# Usage: ./scripts/test-native-local.sh

export PATH="$PATH:$HOME/.maestro/bin"

echo "=== Tamagui Native Tests (Maestro) ==="

# Check maestro
if ! command -v maestro &> /dev/null; then
    echo "❌ Maestro not installed. Install with:"
    echo "   curl -Ls 'https://get.maestro.mobile.dev' | bash"
    exit 1
fi

# Find the built app
APP_PATH=""

# Check DerivedData first (most common)
DERIVED_APP=$(find ~/Library/Developer/Xcode/DerivedData -name "tamaguikitchensink.app" -path "*Debug-iphonesimulator*" -type d 2>/dev/null | head -1)
if [ -n "$DERIVED_APP" ] && [ -d "$DERIVED_APP" ]; then
    APP_PATH="$DERIVED_APP"
fi

# Check local build folder
if [ -z "$APP_PATH" ]; then
    LOCAL_APP="code/kitchen-sink/ios/build/Build/Products/Debug-iphonesimulator/tamaguikitchensink.app"
    if [ -d "$LOCAL_APP" ]; then
        APP_PATH="$LOCAL_APP"
    fi
fi

if [ -z "$APP_PATH" ]; then
    echo "❌ No built app found. Build with:"
    echo "   cd code/kitchen-sink && bun run ios"
    echo ""
    echo "   Or run expo prebuild + xcodebuild:"
    echo "   cd code/kitchen-sink"
    echo "   npx expo prebuild --platform ios"
    echo "   npx expo run:ios"
    exit 1
fi

echo "✅ Found app: $APP_PATH"

# Find a booted simulator or boot one
BOOTED_SIM=$(xcrun simctl list devices | grep "Booted" | head -1 | sed 's/.*(\([^)]*\)).*/\1/' | head -1)

if [ -z "$BOOTED_SIM" ]; then
    echo "📱 No simulator running. Booting iPhone 15 Pro..."

    # Find iPhone 15 Pro simulator
    SIM_UDID=$(xcrun simctl list devices available | grep "iPhone 15 Pro (" | head -1 | sed 's/.*(\([^)]*\)).*/\1/')

    if [ -z "$SIM_UDID" ]; then
        echo "❌ No iPhone 15 Pro simulator found. Create one in Xcode."
        exit 1
    fi

    xcrun simctl boot "$SIM_UDID"
    BOOTED_SIM="$SIM_UDID"

    # Open Simulator app
    open -a Simulator
    sleep 3
fi

echo "✅ Using simulator: $BOOTED_SIM"

# Install the app
echo "📲 Installing app on simulator..."
xcrun simctl install "$BOOTED_SIM" "$APP_PATH"

echo "🧪 Running Maestro tests..."
cd code/kitchen-sink

# Run maestro tests
maestro test flows/ --exclude-tags=util

echo ""
echo "✅ All tests passed!"
