#!/usr/bin/env bash
#
# run each maestro flow as its own invocation, retrying ONLY the flow that
# fails. the previous harness re-ran the WHOLE suite on any failure and only
# passed on a single fully-clean attempt, so a transient flake landing on a
# DIFFERENT flow each attempt could never go green even though every flow
# passed at least once (observed on iOS Native: attempt 1 failed `Select`,
# attempt 2 failed `OpenApp`, each passed on the other attempt -> suite red).
#
# per-flow retry isolates a flake to its own flow and keeps the other flows'
# passes, so the suite goes green as long as every flow passes within its
# own attempt budget.
#
# configuration (env vars, all optional):
#   FLOWS_DIR      directory of flow .yaml files            (default: ./flows)
#   BUNDLE_ID      app to terminate between attempts        (default: com.tamagui.tamaguikitchensink)
#   MAX_ATTEMPTS   attempts per flow before giving up       (default: 3)
#   SKIP_FLOWS     space-separated basenames to skip; these are util
#                  sub-flows / warm-ups, not standalone tests
#                                                            (default: "OpenApp.yaml WarmUp.yaml")
#   METRO_PID_FILE if the pid in this file is dead, abort    (default: /tmp/metro-pid)
#   FLOW_TIMEOUT   hard timeout (seconds) per flow attempt; a wedged xcuitest
#                  driver makes `maestro test` hang with no exit, so without it
#                  the loop never advances and the job sits idle until the
#                  runner's 45-min cap                        (default: 360)
#   MAESTRO_DEVICE_ID
#                  simulator UDID to target explicitly        (default: booted)
#
# NOT using `set -e`: a failing/timed-out `maestro test` is expected and handled inline.

set -uo pipefail

FLOWS_DIR="${FLOWS_DIR:-./flows}"
BUNDLE_ID="${BUNDLE_ID:-com.tamagui.tamaguikitchensink}"
MAX_ATTEMPTS="${MAX_ATTEMPTS:-3}"
SKIP_FLOWS="${SKIP_FLOWS:-OpenApp.yaml WarmUp.yaml}"
METRO_PID_FILE="${METRO_PID_FILE:-/tmp/metro-pid}"
FLOW_TIMEOUT="${FLOW_TIMEOUT:-360}"
MAESTRO_DEVICE_ID="${MAESTRO_DEVICE_ID:-}"

maestro_cmd=(maestro)
if [ -n "$MAESTRO_DEVICE_ID" ]; then
  maestro_cmd+=(--device "$MAESTRO_DEVICE_ID")
fi

metro_alive() {
  local pid
  pid="$(cat "$METRO_PID_FILE" 2>/dev/null || true)"
  [ -z "$pid" ] && return 0 # no tracked pid -> nothing to check
  kill -0 "$pid" 2>/dev/null
}

recover_sim() {
  echo "recovering simulator state (terminate app, keep Hermes bytecode cache)..."
  xcrun simctl terminate "${MAESTRO_DEVICE_ID:-booted}" "$BUNDLE_ID" 2>/dev/null || true
  sleep 2
  if ! metro_alive; then
    echo "::error::Metro died during test run — aborting (every retry would fail)"
    tail -50 /tmp/metro.log 2>/dev/null || true
    exit 1
  fi
}

# run `maestro test <flow>` with a hard per-attempt timeout. when the iOS
# xcuitest driver wedges (e.g. "Request for viewHierarchy failed, code: 500"),
# maestro hangs with no exit — without a timeout the retry loop below never
# advances and the whole job sits idle until the runner's 45-min cap (observed:
# a 28-min hang on one flow that then got force-cancelled = red CI for a flake).
# on timeout we SIGTERM then SIGKILL maestro's PROCESS GROUP — `set -m` gives the
# backgrounded job its own pgid, so killing -$pid also reaps the child
# xcodebuild/driver processes — then recover_sim resets state and the next
# attempt re-establishes a fresh driver. returns maestro's exit code, or 124.
run_flow_with_timeout() {
  local flow="$1"
  set -m
  "${maestro_cmd[@]}" test "$flow" --no-ansi &
  local pid=$!
  set +m
  local waited=0
  while kill -0 "$pid" 2>/dev/null; do
    if [ "$waited" -ge "$FLOW_TIMEOUT" ]; then
      echo "::warning::flow exceeded ${FLOW_TIMEOUT}s — killing maestro (wedged xcuitest driver?)"
      kill -TERM -"$pid" 2>/dev/null || kill -TERM "$pid" 2>/dev/null
      sleep 10
      kill -KILL -"$pid" 2>/dev/null || kill -KILL "$pid" 2>/dev/null
      wait "$pid" 2>/dev/null
      return 124
    fi
    sleep 5
    waited=$((waited + 5))
  done
  wait "$pid"
}

shopt -s nullglob
flows=("$FLOWS_DIR"/*.yaml "$FLOWS_DIR"/*.yml)
shopt -u nullglob

if [ "${#flows[@]}" -eq 0 ]; then
  echo "::error::no flow files found in $FLOWS_DIR"
  exit 1
fi

failed=""
for flow in "${flows[@]}"; do
  base="$(basename "$flow")"
  case " $SKIP_FLOWS " in
    *" $base "*)
      echo "skipping util sub-flow: $base"
      continue
      ;;
  esac

  name="${base%.*}"
  passed=false
  for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
    echo "::group::$name (attempt $attempt/$MAX_ATTEMPTS)"
    if run_flow_with_timeout "$flow"; then
      passed=true
      echo "::endgroup::"
      echo "✓ $name passed (attempt $attempt/$MAX_ATTEMPTS)"
      break
    fi
    echo "::endgroup::"
    echo "::warning::$name failed (attempt $attempt/$MAX_ATTEMPTS)"
    if [ "$attempt" -lt "$MAX_ATTEMPTS" ]; then
      recover_sim
    fi
  done
  if [ "$passed" = false ]; then
    failed="$failed $name"
  fi
done

if [ -n "$failed" ]; then
  echo "::error::flows failed after $MAX_ATTEMPTS attempts:$failed"
  exit 1
fi

echo "all flows passed"
