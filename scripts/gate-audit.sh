#!/bin/bash
# Runs the full gate set against a pinned SHA in an isolated worktree.
#
#   ./scripts/gate-audit.sh <sha> [worktree-path]
#
# The point is the isolation. Run in the shared checkout, every gate measures a
# working tree that other sessions are editing, so the numbers describe neither
# HEAD nor any state that will exist again. Here the tree cannot move: a fresh
# worktree at one commit, its own node_modules, its own build.
#
# It never writes to the shared checkout and never leaves the worktree behind
# unless asked, so it is safe to run while other lanes work.

set -uo pipefail

SHA="${1:?usage: gate-audit.sh <sha> [worktree-path]}"
TREE="${2:-$HOME/.worktrees/gate-audit-$(echo "$SHA" | cut -c1-10)}"
REPO="$(git rev-parse --show-toplevel)"
LOGS="$TREE/.gate-logs"

# resolve before creating anything, so a bad SHA fails here rather than halfway
FULL_SHA="$(git -C "$REPO" rev-parse "$SHA^{commit}")" || exit 1

echo "auditing $FULL_SHA"
echo "worktree $TREE"

if [ ! -d "$TREE" ]; then
  git -C "$REPO" worktree add --detach "$TREE" "$FULL_SHA" || exit 1
fi
mkdir -p "$LOGS"

# every gate: a label, the directory, and the command. Kept as one list so the
# report cannot drift from what was actually run.
run_gate() {
  local label="$1" dir="$2" cmd="$3"
  local log="$LOGS/${label// /-}.log"
  local started=$SECONDS
  ( cd "$TREE/$dir" && eval "$cmd" ) > "$log" 2>&1
  local status=$?
  local counts
  counts=$(sed 's/\x1b\[[0-9;]*m//g' "$log" | grep -E "^ +(Tests|Test Files)" | tr -s ' ' | paste -sd'; ' -)
  [ -z "$counts" ] && counts=$(sed 's/\x1b\[[0-9;]*m//g' "$log" | grep -cE "error TS" | sed 's/^/typescript errors: /')
  printf '%-22s exit=%-3s %ss  %s\n' "$label" "$status" "$((SECONDS - started))" "$counts"
}

echo
echo "--- install (own node_modules, lockfile must already satisfy) ---"
( cd "$TREE" && bun install --frozen-lockfile ) > "$LOGS/install.log" 2>&1
echo "install exit=$?"

echo "--- build ---"
( cd "$TREE" && bun run build ) > "$LOGS/build.log" 2>&1
echo "build exit=$?"

# a build that rewrites tracked declarations means the committed ones were
# stale at this SHA, which is the failure this audit exists to catch
echo "--- declarations rewritten by the build (should be none) ---"
git -C "$TREE" status --porcelain | grep -v '^??' | tee "$LOGS/post-build-dirty.log" | head -30
echo "count: $(git -C "$TREE" status --porcelain | grep -vc '^??')"

echo
echo "--- gates ---"
run_gate "frozen-lockfile"   "."                            "bun install --frozen-lockfile --dry-run"
run_gate "lint"              "."                            "bun run lint"
run_gate "typecheck"         "."                            "bun run typecheck"
run_gate "grammar"           "code/core/style-grammar"      "bun run test"
run_gate "core web"          "code/core/core-test"          "bun run test:web"
run_gate "core native"       "code/core/core-test"          "bun run test:native"
# the glob must reach the shell unquoted, the way the package script writes it;
# quoted, it arrives at vitest as a literal filter and matches nothing
run_gate "static"            "code/compiler/static-tests"   "bun run test:run:web -- tests/*.web.test.tsx"
run_gate "webpack"           "code/compiler/static-tests"   "bun run test:webpack"
run_gate "tailwind web"      "code/core/tailwind"           "bun run test:web"
run_gate "tailwind native"   "code/core/tailwind"           "bun run test:native"
run_gate "web package types" "code/core/web"                "bun run test:web"

# The gates above each run in one fixed order. That makes them reproducible and
# blind to ordering bugs by construction, so this runs the same suites in
# randomised order as a SEPARATE gate. A failure here means one test depends on
# another having run first — it is not a behaviour regression, and conflating
# the two would make every ordering flake look like broken code.
#
# Each iteration's seed is recorded and printed, so a red is reproducible
# immediately. A shuffle gate that only says "failed sometimes" is worse than
# none.
SHUFFLE_ITERATIONS="${SHUFFLE_ITERATIONS:-5}"

run_shuffle_gate() {
  local label="$1" dir="$2" env="$3" glob="$4"
  local log="$LOGS/ordering-${label// /-}.log"
  local started=$SECONDS
  local failures=0 seeds_failed=""
  : > "$log"

  for i in $(seq 1 "$SHUFFLE_ITERATIONS"); do
    # a fresh seed per iteration explores new orderings; recording it is what
    # makes any red actionable
    local seed=$(( (RANDOM << 15 | RANDOM) + i ))
    local cmd="$env npx vitest --run --config ../../packages/vite-plugin-internal/src/vite.config.ts --sequence.shuffle --sequence.seed=$seed $glob"
    echo "=== iteration $i, seed $seed ===" >> "$log"
    ( cd "$TREE/$dir" && eval "$cmd" ) >> "$log" 2>&1
    if [ $? -ne 0 ]; then
      failures=$((failures + 1))
      seeds_failed="$seeds_failed $seed"
    fi
  done

  if [ "$failures" -eq 0 ]; then
    printf '%-22s exit=0   %ss  %s shuffled runs, no ordering dependency\n' \
      "$label" "$((SECONDS - started))" "$SHUFFLE_ITERATIONS"
  else
    printf '%-22s exit=1   %ss  ORDERING FAILURE in %s of %s runs\n' \
      "$label" "$((SECONDS - started))" "$failures" "$SHUFFLE_ITERATIONS"
    echo "    a test here depends on another having run first; this is not a behaviour regression"
    for seed in $seeds_failed; do
      echo "    reproduce: cd $dir && $env npx vitest --run \\"
      echo "                 --config ../../packages/vite-plugin-internal/src/vite.config.ts \\"
      echo "                 --sequence.shuffle --sequence.seed=$seed $glob"
    done
  fi
}

echo
echo "--- ordering gates (shuffled; a red here is test order, not behaviour) ---"
run_shuffle_gate "core native order" "code/core/core-test" "TAMAGUI_TARGET=native" "*.native.test.tsx"
run_shuffle_gate "core web order"    "code/core/core-test" "TAMAGUI_TARGET=web"    "*.web.test.tsx"

echo
echo "logs in $LOGS"
echo "remove with: git -C $REPO worktree remove --force $TREE"
