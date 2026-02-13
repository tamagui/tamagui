#!/usr/bin/env bash
set -euo pipefail

# Periodically runs `codex review` to re-review the current branch diff vs main.
#
# Usage:
#   scripts/flat_styles_review_loop.sh
#   scripts/flat_styles_review_loop.sh --once
#   scripts/flat_styles_review_loop.sh --interval 900 --model gpt-5
#   scripts/flat_styles_review_loop.sh --max-reviews 4
#
# Env:
#   OPENAI_MODEL     (optional fallback model name)

INTERVAL_SECONDS=900
MODEL="${OPENAI_MODEL:-gpt-5}"
BASE_BRANCH="main"
ONCE="false"
OUT_FILE="plans/flat-styles-code-review-loop.md"
MAX_REVIEWS=4

while [[ $# -gt 0 ]]; do
  case "$1" in
    --interval)
      INTERVAL_SECONDS="${2:-}"
      shift 2
      ;;
    --model)
      MODEL="${2:-}"
      shift 2
      ;;
    --base)
      BASE_BRANCH="${2:-}"
      shift 2
      ;;
    --out)
      OUT_FILE="${2:-}"
      shift 2
      ;;
    --once)
      ONCE="true"
      shift
      ;;
    --max-reviews)
      MAX_REVIEWS="${2:-}"
      shift 2
      ;;
    *)
      echo "Unknown arg: $1" >&2
      exit 1
      ;;
  esac
done

if ! command -v codex >/dev/null 2>&1; then
  echo "codex CLI is required." >&2
  exit 1
fi

mkdir -p "$(dirname "$OUT_FILE")"

build_prompt() {
  local ts diff_names diff_stat
  ts="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  diff_names="$(git diff --name-only "${BASE_BRANCH}...HEAD")"
  diff_stat="$(git diff --stat "${BASE_BRANCH}...HEAD")"

  cat <<EOF
Timestamp: ${ts}
Repository review task:
Please do a strict re-review of the current branch against ${BASE_BRANCH}.
Be especially critical about tests, type safety, and correctness of implementation behavior.
Prioritize concrete bugs/risks/regressions over style feedback.
Return output as markdown with:
1) Findings ordered by severity
2) Testing gaps and missing cases
3) Short recommended next actions

Changed files:
${diff_names}

Diff stat:
${diff_stat}
EOF
}

run_review() {
  local prompt text stamp
  prompt="$(build_prompt)"

  if ! text="$(codex review --base "$BASE_BRANCH" --config "model=\"$MODEL\"" "$prompt" 2>&1)"; then
    echo "codex review failed:" >&2
    echo "$text" >&2
    return 1
  fi

  stamp="$(date -u +"%Y-%m-%d %H:%M:%SZ")"
  {
    echo ""
    echo "## Re-review ${stamp}"
    echo ""
    echo "$text"
    echo ""
  } >> "$OUT_FILE"

  echo "Wrote re-review to ${OUT_FILE} (${stamp})"
}

if [[ "$ONCE" == "true" ]]; then
  run_review
  exit 0
fi

echo "Starting loop: every ${INTERVAL_SECONDS}s, max_reviews=${MAX_REVIEWS}, base=${BASE_BRANCH}, model=${MODEL}, out=${OUT_FILE}"
reviews_done=0
while (( reviews_done < MAX_REVIEWS )); do
  sleep "$INTERVAL_SECONDS"
  run_review || true
  reviews_done=$((reviews_done + 1))
done
echo "Completed ${reviews_done} review(s). Exiting."
