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
# It never writes to the shared checkout. It retains the isolated worktree and
# logs for review; the final line prints the explicit removal command.

set -uo pipefail

SHA="${1:?usage: gate-audit.sh <sha> [worktree-path]}"
TREE="${2:-$HOME/.worktrees/gate-audit-$(echo "$SHA" | cut -c1-10)}"
REPO="$(git rev-parse --show-toplevel)"
LOGS="$TREE/.gate-logs"
RESULTS="$LOGS/results.tsv"
METADATA="$LOGS/metadata.txt"
AUDIT_FAILURES=0
AUDIT_STARTED_UTC="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# resolve before creating anything, so a bad SHA fails here rather than halfway
FULL_SHA="$(git -C "$REPO" rev-parse "$SHA^{commit}")" || exit 1

echo "auditing $FULL_SHA"
echo "worktree $TREE"

if [ -e "$TREE" ]; then
  echo "audit path already exists: $TREE"
  echo "choose a fresh path or remove the old audit worktree explicitly"
  exit 1
fi
git -C "$REPO" worktree add --detach "$TREE" "$FULL_SHA" || exit 1
mkdir -p "$LOGS"
printf 'sha=%s\nstarted_utc=%s\nworktree=%s\n' \
  "$FULL_SHA" "$AUDIT_STARTED_UTC" "$TREE" > "$METADATA"
printf 'gate\texit\tseconds\tcounts\n' > "$RESULTS"
trap 'status=$?; printf "finished_utc=%s\nexit=%s\n" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$status" >> "$METADATA"' EXIT

# every gate: a label, the directory, and the command. Kept as one list so the
# report cannot drift from what was actually run.
run_gate() {
  local label="$1" dir="$2" cmd="$3"
  local log="$LOGS/${label// /-}.log"
  local started=$SECONDS
  ( cd "$TREE/$dir" && eval "$cmd" ) > "$log" 2>&1
  local status=$?
  local counts
  counts=$(
    sed 's/\x1b\[[0-9;]*m//g' "$log" |
      grep -E "^ +(Tests|Test Files)|^ *[0-9]+ pass$|^Ran [0-9]+ tests" |
      tr -s ' ' |
      paste -sd'; ' -
  )
  [ -z "$counts" ] &&
    counts=$(
      sed 's/\x1b\[[0-9;]*m//g' "$log" |
        grep -cE "error TS" |
        sed 's/^/typescript errors: /'
    )
  printf '%-22s exit=%-3s %ss  %s\n' "$label" "$status" "$((SECONDS - started))" "$counts"
  printf '%s\t%s\t%s\t%s\n' "$label" "$status" "$((SECONDS - started))" "$counts" >> "$RESULTS"
  if [ "$status" -ne 0 ]; then
    AUDIT_FAILURES=$((AUDIT_FAILURES + 1))
  fi
}

echo
echo "--- install (own node_modules, lockfile must already satisfy) ---"
( cd "$TREE" && bun install --frozen-lockfile ) > "$LOGS/install.log" 2>&1
INSTALL_STATUS=$?
echo "install exit=$INSTALL_STATUS"
if [ "$INSTALL_STATUS" -ne 0 ]; then
  echo "install failed; later gates would not describe the requested commit"
  exit 1
fi

echo "--- build ---"
( cd "$TREE" && bun run build ) > "$LOGS/build.log" 2>&1
BUILD_STATUS=$?
echo "build exit=$BUILD_STATUS"
if [ "$BUILD_STATUS" -ne 0 ]; then
  echo "build failed; source-versus-dist conformance cannot be measured"
  exit 1
fi

# a build that rewrites tracked declarations means the committed ones were
# stale at this SHA, which is the failure this audit exists to catch
echo "--- declarations rewritten by the build (should be none) ---"
git -C "$TREE" status --porcelain --untracked-files=no > "$LOGS/post-build-dirty.log"
sed -n '1,30p' "$LOGS/post-build-dirty.log"
DIRTY_COUNT=$(wc -l < "$LOGS/post-build-dirty.log" | tr -d ' ')
UNEXPECTED_DIRTY_COUNT=$(
  grep -vE '^ M code/tamagui\.dev/tamagui\.generated\.css$' \
    "$LOGS/post-build-dirty.log" |
    grep -c .
)
echo "count: $DIRTY_COUNT ($UNEXPECTED_DIRTY_COUNT unexpected)"
if [ "$UNEXPECTED_DIRTY_COUNT" -ne 0 ]; then
  AUDIT_FAILURES=$((AUDIT_FAILURES + 1))
fi

verify_ci_plan() {
  local label="$1" command="$2" required="$3"
  local plan="$LOGS/ci-${label}.json"
  local error_log="$LOGS/ci-${label}.err"
  local summary="$LOGS/ci-${label}-tasks.txt"

  ( cd "$TREE" && eval "$command" ) > "$plan" 2> "$error_log"
  local status=$?
  if [ "$status" -ne 0 ]; then
    echo "CI graph $label exit=$status"
    AUDIT_FAILURES=$((AUDIT_FAILURES + 1))
    return
  fi

  # shellcheck disable=SC2016
  PLAN_PATH="$plan" REQUIRED_TASKS="$required" bun -e '
    const plan = await Bun.file(process.env.PLAN_PATH).json()
    const tasks = new Map(plan.tasks.map((task) => [task.taskId, task.command]))
    const required = process.env.REQUIRED_TASKS.split(",")
    const missing = required.filter((task) => {
      const command = tasks.get(task)
      return command === undefined || command === "<NONEXISTENT>"
    })
    const executable = plan.tasks
      .filter((task) => task.task === required[0].split("#").at(-1))
      .filter((task) => task.command !== "<NONEXISTENT>")
      .map((task) => `${task.taskId}\t${task.command}`)
      .sort()
    console.log(executable.join("\n"))
    if (missing.length) {
      console.error(`missing executable CI tasks: ${missing.join(", ")}`)
      process.exit(1)
    }
  ' > "$summary" 2>> "$error_log"
  status=$?

  printf 'CI graph %-13s exit=%s  %s executable tasks\n' \
    "$label" "$status" "$(wc -l < "$summary" | tr -d ' ')"
  if [ "$status" -ne 0 ]; then
    AUDIT_FAILURES=$((AUDIT_FAILURES + 1))
  fi
}

echo
echo "--- CI task graph (the matrix must be executable in checks.yaml) ---"
verify_ci_plan \
  "test-web" \
  "bun turbo run test:web --filter='!@tamagui/kitchen-sink' --dry=json" \
  "@tamagui/build#test:web,@tamagui/codemod-flat-values#test:web,@tamagui/components-test#test:web,@tamagui/core-test#test:web,@tamagui/dom#test:web,@tamagui/eslint-plugin#test:web,@tamagui/language-service#test:web,@tamagui/static-tests#test:web,@tamagui/style-grammar#test:web,@tamagui/tailwind#test:web,@tamagui/to-tailwind#test:web,@tamagui/web#test:web,integration#test:web"
verify_ci_plan \
  "test-native" \
  "bun turbo run test:native --filter=@tamagui/static-tests --filter=@tamagui/core-test --filter=@tamagui/components-test --dry=json" \
  "@tamagui/static-tests#test:native,@tamagui/core-test#test:native,@tamagui/components-test#test:native"

echo
echo "--- gates ---"
run_gate "frozen-lockfile"   "."                            "bun install --frozen-lockfile --dry-run"
run_gate "config v6 defaults" "code/core/config"            "bun run check:v6-tailwind-defaults && bun run test:v6-tailwind-defaults"
run_gate "build package"     "code/packages/build"          "bun run test:web"
run_gate "lint"              "."                            "bun run lint"
run_gate "typecheck"         "."                            "bun run typecheck"
run_gate "grammar"           "code/core/style-grammar"      "bun run test"
run_gate "dom contract"      "code/core/dom"                "bun run test:web"
run_gate "eslint plugin"     "code/core/eslint-plugin"      "bun run test:web"
run_gate "language service"  "code/core/language-service"   "bun run test:web"
run_gate "codemod"           "code/core/codemod-flat-values" "bun run test:web"
run_gate "core web"          "code/core/core-test"          "bun run test:web"
run_gate "core native"       "code/core/core-test"          "bun run test:native"
run_gate "components web"    "code/ui/components-test"      "bun run test:web"
run_gate "components native" "code/ui/components-test"      "bun run test:native"
# the glob must reach the shell unquoted, the way the package script writes it;
# quoted, it arrives at vitest as a literal filter and matches nothing
run_gate "static"            "code/compiler/static-tests"   "bun run test:run:web -- tests/*.web.test.tsx"
run_gate "static native"     "code/compiler/static-tests"   "bun run test:native"
run_gate "webpack"           "code/compiler/static-tests"   "bun run test:webpack"
run_gate "tailwind web"      "code/core/tailwind"           "bun run test:web"
run_gate "tailwind native"   "code/core/tailwind"           "bun run test:native"
run_gate "tailwind types"    "code/core/tailwind"           "bun run test:types"
run_gate "to-tailwind"       "code/core/to-tailwind"        "bun run test:web"
run_gate "web package types" "code/core/web"                "bun run test:web"

# The gates above each run in one fixed order. That makes them reproducible and
# blind to ordering bugs by construction, so this runs the same suites in
# randomised order as a SEPARATE gate. A failure here means one test depends on
# another having run first. It is not a behaviour regression, and conflating
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
    if ! ( cd "$TREE/$dir" && eval "$cmd" ) >> "$log" 2>&1; then
      failures=$((failures + 1))
      seeds_failed="$seeds_failed $seed"
    fi
  done

  if [ "$failures" -eq 0 ]; then
    printf '%-22s exit=0   %ss  %s shuffled runs, no ordering dependency\n' \
      "$label" "$((SECONDS - started))" "$SHUFFLE_ITERATIONS"
    printf '%s\t0\t%s\t%s shuffled runs\n' \
      "$label" "$((SECONDS - started))" "$SHUFFLE_ITERATIONS" >> "$RESULTS"
  else
    printf '%-22s exit=1   %ss  ORDERING FAILURE in %s of %s runs\n' \
      "$label" "$((SECONDS - started))" "$failures" "$SHUFFLE_ITERATIONS"
    printf '%s\t1\t%s\t%s of %s shuffled runs failed\n' \
      "$label" "$((SECONDS - started))" "$failures" "$SHUFFLE_ITERATIONS" >> "$RESULTS"
    AUDIT_FAILURES=$((AUDIT_FAILURES + 1))
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
if [ "$AUDIT_FAILURES" -ne 0 ]; then
  echo "audit failed: $AUDIT_FAILURES gate or integrity checks failed"
  exit 1
fi
echo "audit passed"
