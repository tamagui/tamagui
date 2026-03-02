#!/bin/bash
set -euo pipefail

# Prune old pre-release tags superseded by stable releases.
# Run with --dry-run first to preview.

DRY_RUN=false
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

PATTERNS=(
  'v1.0.0-alpha.*'
  'v1.0.0-beta.*'
  'v1.0.1-beta.*'
  'v0.2.0-alpha.*'
  'canary*'
)

TOTAL=0
for pattern in "${PATTERNS[@]}"; do
  tags=$(git tag -l "$pattern")
  count=$(echo "$tags" | grep -c . 2>/dev/null || echo 0)
  [[ -z "$tags" ]] && continue

  echo "=== $pattern ($count tags) ==="

  if $DRY_RUN; then
    echo "$tags"
  else
    echo "$tags" | while read -r tag; do
      git tag -d "$tag" 2>/dev/null || true
      git push origin --delete "$tag" 2>/dev/null || true
    done
  fi

  TOTAL=$((TOTAL + count))
  echo ""
done

if $DRY_RUN; then
  echo "DRY RUN: Would delete $TOTAL tags. Run without --dry-run to execute."
else
  echo "Deleted $TOTAL tags."
fi
