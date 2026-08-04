#!/usr/bin/env bash
set -euo pipefail

# metro must already be running on port 8081. this script only launches the
# installed dev-client app and records the simulator; it never starts metro.
SIM_UDID="${1:-F91BE159-9281-46C9-9F53-01A640D9010A}"
OUT="${2:-/tmp/native-showdown.mov}"
APP_ID="com.tamagui.tamaguikitchensink"
RECORD_PID=""

stop_recording() {
  if [[ -n "$RECORD_PID" ]] && kill -0 "$RECORD_PID" 2>/dev/null; then
    kill -INT "$RECORD_PID" 2>/dev/null || true
    wait "$RECORD_PID" || true
  fi
  RECORD_PID=""
}

trap stop_recording EXIT INT TERM

xcrun simctl boot "$SIM_UDID" >/dev/null 2>&1 || true
xcrun simctl bootstatus "$SIM_UDID" -b
xcrun simctl ui "$SIM_UDID" appearance light
# a fresh launch is required for -directUseCase args to apply
xcrun simctl terminate "$SIM_UDID" "$APP_ID" >/dev/null 2>&1 || true
xcrun simctl launch "$SIM_UDID" "$APP_ID" \
  -directUseCase NativeRegistryShowdownCase

xcrun simctl io "$SIM_UDID" recordVideo --codec h264 "$OUT" &
RECORD_PID=$!

sleep 2
if ! xcodebuildmcp ui-automation tap \
  --simulator-id "$SIM_UDID" \
  --id startShowdown; then
  # snapshot-ui runs axe describe-ui and prints exact element frames. this
  # coordinate is the center of the full-width start button in this layout.
  xcodebuildmcp ui-automation snapshot-ui --simulator-id "$SIM_UDID"
  xcodebuildmcp ui-automation tap \
    --simulator-id "$SIM_UDID" \
    --x 201 \
    --y 114
fi

sleep 18
stop_recording
trap - EXIT INT TERM

printf 'showdown video: %s\n' "$OUT"
