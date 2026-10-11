#!/usr/bin/env bash

set -euo pipefail

mkdir -p e2e/artifacts

logcat_ready=false
for attempt in $(seq 1 30); do
  if adb logcat -c; then
    logcat_ready=true
    break
  fi
  echo "logcat is not ready (attempt $attempt/30)"
  sleep 2
done
if [ "$logcat_ready" != "true" ]; then
  echo "logcat did not become ready within 60 seconds"
  exit 1
fi

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
