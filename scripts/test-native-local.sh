#!/bin/bash
set -e

# Run Maestro tests locally for kitchen-sink and kitchen-sink-go
# Usage: ./scripts/test-native-local.sh [kitchen-sink|kitchen-sink-go|all]
# Default: all

export PATH="$PATH:$HOME/.maestro/bin"

TARGET="${1:-all}"

echo "=== Tamagui Native Tests (Maestro) ==="

# Check maestro
if ! command -v maestro &> /dev/null; then
    echo "Maestro not installed. Install with:"
    echo "   curl -Ls 'https://get.maestro.mobile.dev' | bash"
    exit 1
fi

# Find a booted simulator or boot one
BOOTED_SIM=$(xcrun simctl list devices | grep "Booted" | head -1 | sed 's/.*(\([^)]*\)).*/\1/' | head -1)

if [ -z "$BOOTED_SIM" ]; then
    echo "No simulator running. Booting iPhone 15 Pro..."
    SIM_UDID=$(xcrun simctl list devices available | grep "iPhone 15 Pro (" | head -1 | sed 's/.*(\([^)]*\)).*/\1/')

    if [ -z "$SIM_UDID" ]; then
        echo "No iPhone 15 Pro simulator found. Create one in Xcode."
        exit 1
    fi

    xcrun simctl boot "$SIM_UDID"
    BOOTED_SIM="$SIM_UDID"
    open -a Simulator
    sleep 3
fi

echo "Using simulator: $BOOTED_SIM"

find_and_install_app() {
    local APP_NAME="$1"
    local APP_DIR="$2"
    local APP_PATH=""

    # Check DerivedData first
    DERIVED_APP=$(find ~/Library/Developer/Xcode/DerivedData -name "${APP_NAME}.app" -path "*Debug-iphonesimulator*" -type d 2>/dev/null | head -1)
    if [ -n "$DERIVED_APP" ] && [ -d "$DERIVED_APP" ]; then
        APP_PATH="$DERIVED_APP"
    fi

    # Check local build folder
    if [ -z "$APP_PATH" ]; then
        LOCAL_APP="${APP_DIR}/ios/build/Build/Products/Debug-iphonesimulator/${APP_NAME}.app"
        if [ -d "$LOCAL_APP" ]; then
            APP_PATH="$LOCAL_APP"
        fi

        # Also check build/ directly
        LOCAL_APP="${APP_DIR}/build/Build/Products/Debug-iphonesimulator/${APP_NAME}.app"
        if [ -d "$LOCAL_APP" ]; then
            APP_PATH="$LOCAL_APP"
        fi
    fi

    if [ -z "$APP_PATH" ]; then
        echo "No built ${APP_NAME}.app found. Build with:"
        echo "   cd ${APP_DIR} && bun run ios"
        return 1
    fi

    echo "Found app: $APP_PATH"
    echo "Installing on simulator..."
    xcrun simctl install "$BOOTED_SIM" "$APP_PATH"
    return 0
}

run_kitchen_sink() {
    echo ""
    echo "=== Kitchen Sink ==="
    if find_and_install_app "tamaguikitchensink" "code/kitchen-sink"; then
        cd code/kitchen-sink
        maestro test flows/ --exclude-tags=util
        cd ../..
        echo "Kitchen Sink tests passed!"
    else
        return 1
    fi
}

run_kitchen_sink_go() {
    echo ""
    echo "=== Kitchen Sink Go ==="
    if find_and_install_app "kitchensinkgo" "code/kitchen-sink-go"; then
        cd code/kitchen-sink-go
        maestro test flows/ --exclude-tags=util
        cd ../..
        echo "Kitchen Sink Go tests passed!"
    else
        return 1
    fi
}

case "$TARGET" in
    kitchen-sink)
        run_kitchen_sink
        ;;
    kitchen-sink-go|go)
        run_kitchen_sink_go
        ;;
    all)
        FAILED=0
        run_kitchen_sink || FAILED=1
        run_kitchen_sink_go || FAILED=1
        if [ $FAILED -ne 0 ]; then
            echo ""
            echo "Some tests failed!"
            exit 1
        fi
        ;;
    *)
        echo "Usage: $0 [kitchen-sink|kitchen-sink-go|all]"
        exit 1
        ;;
esac

echo ""
echo "All tests passed!"
