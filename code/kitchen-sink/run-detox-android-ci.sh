#!/usr/bin/env bash

set -euo pipefail

mkdir -p e2e/artifacts
adb logcat -c
adb logcat -v threadtime \
  AndroidRuntime:E \
  ReactNativeJS:V \
  ReactNative:V \
  Detox:V \
  ActivityManager:I \
  ActivityTaskManager:I \
  '*:S' > e2e/artifacts/android-logcat.txt &
logcat_pid=$!

cleanup() {
  kill "$logcat_pid" 2>/dev/null || true
  wait "$logcat_pid" 2>/dev/null || true
}
trap cleanup EXIT

set +e
bun run ../packages/native-ci/src/run-detox-android.ts \
  --headless \
  --project-root "$PWD" \
  --record-logs failing \
  --retries 0
test_status=$?
set -e

exit "$test_status"
