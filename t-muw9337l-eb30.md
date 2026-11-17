---
id: t-muw9337l-eb30
title: Review pushed Bento cleanup
status: done
labels:
- branch:tm/bento-land
- lane:bento-cleanup-review
backend: git
created_at: 1791265258497
updated_at: 1791265704678
field_marks:
  active_form: 1791265258497
  body: 1791265704678
  claim: 1791265258497
  evidence_summary: 1791265258497
  parent: 1791265258497
  priority: 1791265258497
  recovery_ref: 1791265258497
  status: 1791265704634
  title: 1791265258497
---
Read-only Bento cleanup review

Branch: origin/tm/bento-land
Reviewed: 3953d01015..91f9e6e34fc9374daa29219504f70ec50f59663c (all four commits, full 920-line diff).
Verdict: two findings; no code edited or commits created. Implementation and any fixes remain with p64457.

1. P2: preserve unmatched bold delimiters in comment previews.
File: code/bento/src/forms/textareas/WritePreviewAction.tsx:82 (also line 85).
TESTED: the actual renderInline function, transpiled without rewriting its logic, emits an empty child for input "**", "***", and "****". A live Chromium probe typed a separate "**" line, switched to Preview, and the visible panel omitted that line. Basic bold/italic/code rendered and script markup stayed escaped.
Cause: split leaves unmatched text untouched, but the map classifies any part that starts and ends with two stars as bold, then slices away both ends even when there is no content. Restrict the bold branch to a complete nonempty token so literal delimiter-only lines remain visible. If this were correct, the panel would retain "**"; the assertion failed with received "bold italic code<script>window.__injected=1</script>".
Evidence: bento-review-logic.log, bento-review-interactions.log, bento-review-markdown.png.

2. P3: clear existing card transforms when reduced motion becomes active.
File: code/bento/src/animation/microinteractions/InteractiveCard.tsx:164 (related lines 151-155 and 54-60).
RAN: Chromium with reduced motion at initial load produced no raised child transforms. With motion allowed, hovering raised children by 10-50px. Enabling reduced motion while hovered and moving outside reset the container to rotateY(0deg) rotateX(0deg), but the children still had translateZ(10px)..translateZ(50px) after two animation frames. The assertion expecting no positive translateZ failed.
Cause: the new early return skips the reset path as well as the animation path, and the preference has no change subscription to clear the existing transforms. Reset to identity without animation when reduction becomes active; continue suppressing new tilt. If correct, the child layers would be flat after exit.
Evidence: bento-review-tilt-settled.log, bento-review-tilt.png.

RAN focused passing probes: +44/44, case-insensitive region codes, no-match and empty dial-code filtering; UI selection updates +44/+1. Image picker at 360px: five uploads, removal, exactly one matching object-URL revocation, re-add, loaded thumbnails, no horizontal overflow, return to empty state. Meeting collapse preserves title/date and other card details, aria-expanded updates, Enter re-expands. Breadcrumb names pass for Radio Groups, Text Areas, Image Picker, Pricing and Product Page. Final interaction pages emitted no pageerror events.
RAN: Bento tsc --noEmit, focused oxlint and git diff --check passed.

Runtime setup: isolated detached tm worktree at the reviewed SHA; own One dev server on 8107. Frozen dependency install; ignored v3 artifacts copied from the existing local v3 worktree, missing site dependency artifacts built individually. No native-device or production-build validation; no broad theme/device sweep repeated.

Evidence directory: /Users/n8/.team-machine/reviews/bento-cleanup-91f9e6e34f
Cleanup: server stopped and review worktree released before tm finish; no CI ownership transferred because this was read-only review.
Next: p64457 fixes the two findings on the branch. No owner decision required by this review.
