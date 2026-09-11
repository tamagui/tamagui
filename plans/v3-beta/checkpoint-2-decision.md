# Checkpoint 2 decision

Checkpoint 2 stops without adding general definition-time metadata. Checkpoint 3
will compile that metadata as part of its new engine, where the runtime traversal
and its old setup can be deleted together.

## Existing compilation on `v3-beta`

The current engine already owns these immutable inputs outside the render path:

- `grammarConfig.ts` compiles modifier and media vocabulary into the revisioned
  config record. `directStyle` and clause identity consume that record.
- Property, token, and transform lookup tables are module-level constants.
- `createTamagui` builds shorthand tables when it creates the config.
- `propMapper` compiles and caches variant resolver keys in a `WeakMap` on first
  use.
- Checkpoint 2b already hoisted the render invariants listed in section 6.3 of
  the plan.

## Prototype receipts

The general metadata prototype added variant, compound, default-prop, and
frontend records while keeping the current engine. On the same machine and
source revision, the processor fixture grew from 21,624 to 22,014 complete gzip
bytes. The paired clause-string profile update median moved from 10.2 ms to
11.2 ms. Its mount median moved from 9.9 ms to 11.4 ms. The prototype therefore
failed both checkpoint gates and was removed.

The frontend-only extraction also failed the size gate. It moved the processor
fixture from 21,624 to 21,659 bytes and the public `View` fixture from 44,610 to
44,868 bytes, so it was removed too.

Revision-aware Tailwind normalization and grammar caches were neutral in both
fixtures: processor 21,624 to 21,624 bytes and public `View` 44,610 to 44,610
bytes. That isolated fix remains in checkpoint 2.

## Functional variant contract

Section 7.2 item 3 conflicts with
[`v3-functional-variant-props-contract.md`](../v3-functional-variant-props-contract.md).
The accepted contract requires `mergeComponentProps` to materialize merged props
for every component until checkpoint 3 replaces the current traversal. Marking
only functional-variant components now would leave two traversals or change
observable getter timing, so checkpoint 2 does neither.

## Verdict

Checkpoint 3 owns variant, compound-selector, property, shorthand, token,
transform, and functional-variant metadata. It must compile them into the new
engine representation and delete the corresponding old setup in the same unit.
This keeps one revisioned owner and avoids shipping metadata that only adds bytes
beside a still-reachable predecessor.

## Validation

- **RAN** `bun run test` in `code/core/tailwind`: 19 web files with 462 tests,
  plus 4 native files with 275 tests.
- **TESTED** a config revision invalidates both the normalized static-config
  cache and its shared grammar view. A new media key changes a previously
  unclaimed Tailwind class into the expected media rule.
