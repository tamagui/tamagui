# Lane E — legacy condition machinery deletion map

Prepared while the user decision is pending. This is the execution plan for
the blocked half of the contraction (design record, "The engine
contraction"); nothing here is landed. Line anchors are as of `39ae0b974a`
and will drift — re-grep before cutting.

## What the user is deciding

1. Remove the `legacyConditionObjects: false` escape (condition objects
   always convert to programs; the v1 CSS shape disappears).
2. Unconvertible condition values stop rendering: dev diagnostic naming the
   migration, production drop with one console.error per distinct value.

Both are user-visible; the boundary description sent to the manager on
2026-07-31 is the reference text.

## Execution stages, each committed green

### D1 — always-convert at the gate

- `getSplitStyles.tsx`: `legacyConditionObjects` read (`getSetting` at the
  `orderedProcessedProps` block) goes away; `contributeLegacyCondition`
  becomes unconditional. Conversion failure no longer falls through: dev
  throws/warns with the converter's error (it already names dot-path tokens,
  quoted-`$` mixes, part props), production drops + one `console.error`
  (mirror the parse-cache posture, cache the key).
- `createComponent.tsx`: the `legacyConditionObjects !== false` branch that
  aliases a group entry onto the container keys (`next['@'] = entry`)
  stays — it is gated on the setting only for v4 shape; decide with the
  manager whether v3 keeps group-as-container (decision 17 says yes until
  v4). Keep, drop only the setting read.
- Setting removal from public types is a CODEX-2-style types cleanup;
  coordinate so nothing imports `legacyConditionObjects` after.

### D2 — delete the legacy condition machinery in getSplitStyles

Now-dead regions (they were only reachable via the gate-off path or
conversion fallthrough):

- pseudo-object handling blocks (`pseudoDescriptors` branches in the main
  loop; the `isMediaOrPseudo` legacy merge paths).
- `getSubStyle` recursion and its callers.
- the media-object sub-style path: `mergeMediaStyle`, media importance
  ordering, `mediaStylesSeen`, `createMediaStyle` legacy tiers.
- `usedKeys` importance tiers: collapse to the seen-check (base-only).
  `mergeStylePropAtCurrentPosition` importance arguments simplify to the
  single tier.
- `$theme-*` / `$platform-*` / `$group-*` prop-key parsing in the loop
  (`normalizeGroupKey` stays only if converted group keys still route
  through it — they do, via `contributeLegacyCondition`; re-check).
- `noteLegacyConditionFallback` and its dev bookkeeping (replaced by the D1
  diagnostic).

Test pins to retire/replace in the same commit: `legacyConditionGate.*`
(the gate is gone — keep the conversion-parity tests, retitle), the
MixedCascade kitchen-sink fixture (designed retirement signal — remove with
a commit message saying exactly that), any `$theme-dark`-object tests that
assert legacy rule text.

### D3 — delete the specificity apparatus in getCSSStylesAtomic

Only after D2 (the pseudo/media emitters are the last consumers):

- `selectorPriority` / pseudo `!important` / `pseudoIdPostfix` machinery —
  pseudo styles now only arrive as converted program clauses.
- media `:root`-repetition ladders in `createMediaStyle`.
- `.cls.cls` doubling once D2 confirms the style prop no longer emits CSS
  shorthand properties (`cssShorthandLonghands` check) — verify with a grep
  of emitted properties in the suites first; if `style={{ border: ... }}`
  still emits `border`, doubling stays and the design note gets amended.
- enterStyle's dual selector: converted `enter:` clauses lower through
  `.t_unmounted` (`lowerProgram`), so the legacy dual selector goes.

### D4 — the unifications on cleared ground

- one emitter: `getCSSStylesAtomic`'s remaining base-value emission routes
  through `lowerProgram`'s encoding (wrap plain values as base-only
  programs at emission; identifiers become program hashes — LAST corpus-wide
  class churn, coordinate a CODEX-2 rebaseline window).
- one resolver: `getTokenForKey` merges into the grammar context lookup
  (`resolveConfigName` adapter with the resolveAs/opacity-modifier/font
  side-effect semantics as output adapters over the shared maps).

### D5 — measure

- bundle probe (`/tmp/lane-e-bundle-probe.mjs` method) vs the standing
  144.2 KB min / 52.1 KB gzip.
- `getSplitStyles` branch tokens vs 362 / 2,464 lines.
- render-loop bench + parse bench vs the recorded ranges (note: a uniform
  ~3-6% environment drift was observed on 2026-07-31 under fleet load;
  compare shapes, not absolute single runs).
- kitchen-sink playwright: FlatValuePrograms, ProgramBlockDelivery,
  MixedCascade retirement.
