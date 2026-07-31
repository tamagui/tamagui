# Pre-push gate audit

Run by Lane D, 2026-07-30, before pushing the v3-beta branch.

The question asked was: does every gate we quote actually measure what we think
it does, at HEAD, from a clean state?

**The short answer is no, and not because the gates are wrong. Nothing measured
HEAD.** Every number below is a reading of a working tree that four lanes were
actively editing while it was taken.

## The conditions the audit ran under

- HEAD at start: `34d3585056`. HEAD at finish: `50c48899ac`. It advanced by one
  commit mid-audit.
- Tracked files modified but uncommitted: **34 at the start, 42 at the finish**.
  Two were staged in the index at one point and committed before I could read
  them.
- So a gate reading taken now describes neither HEAD nor any state that will
  exist again. What gets pushed is HEAD; nobody has measured HEAD.

That is the headline. Everything else is detail.

## The numbers, and what each one is actually measuring

Fresh `bun run build` first (168 packages, exit 0), then each gate in turn.

| Gate | Command | Result | What it measured |
|---|---|---|---|
| frozen-lockfile | `bun install --frozen-lockfile --dry-run` | **exit 0** | HEAD — the lockfile is committed |
| lint | `bun run lint` | **exit 0** (warnings only) | working tree, including uncommitted files |
| typecheck | `bun run typecheck` | **exit 0**, 0 errors | working tree, **against stale committed declarations** — see below |
| grammar | `code/core/style-grammar` `bun run test` | **369 passed / 21 files** | working tree; 3 dirty source files, 2 dirty test files |
| core web | `code/core/core-test` `test:web` | **1 failed**, 413 passed, 2 skipped, 1 todo / 47 files | working tree; the failing test does not exist at HEAD |
| core native | `code/core/core-test` `test:native` | **176 passed**, 7 expected fail, 11 skipped / 21 files | working tree |
| static | `code/compiler/static-tests` `tests/*.web.test.tsx` | **110 passed**, 2 skipped / 14 files | working tree |
| webpack | `code/compiler/static-tests` `test:webpack` | **1 failed**, 19 passed / 20 | working tree; could not attribute — see below |
| tailwind web | `code/core/tailwind` `test:web` | **459 passed / 20 files** | working tree |
| tailwind native | `code/core/tailwind` `test:native` | **271 passed / 4 files** | working tree |
| web package types | `code/core/web` `test:web` | **90 passed / 8 files**, no type errors | working tree |

## Findings

### 1. The `code/ui/**` declarations are stale at HEAD

A fresh build rewrote **14 tracked `code/ui/*/types/*.d.ts` files** that were
clean before it. This is not build churn — it is a real semantic change:

```
-    color?: "unset" | GetThemeValueForKey<"color"> | OpaqueColorValue | undefined;
+    color?: FlatStyleValue<"unset" | GetThemeValueForKey<"color"> | OpaqueColorValue | undefined>;
```

Checked against HEAD rather than inferred:

- `FlatStyleValue` **is** in committed `code/core/web/src/types.tsx` (source).
- It **is** in committed `code/core/web/types/types.d.ts` (that package's own
  build output was committed).
- It is **absent** from every committed `code/ui/**` declaration.

So whoever landed the flat-value type rebuilt and committed `@tamagui/web`'s own
declarations but not the downstream UI packages'. At HEAD, `Input`, `TextArea`,
`Sheet`, `Dialog`, `AlertDialog`, `Checkbox`, `Field`, `RadioGroup`, `Spinner`,
`Switch` and `Tooltip` all publish prop types that **do not admit flat string
values** — the headline v3 authoring feature is missing from their public types.

This is the one finding I would hold the push for.

**Confirmed in a clean room, 2026-07-30.** The above was measured in the shared
tree, where uncommitted work is a competing explanation. So it was re-run in an
isolated worktree at `a37ac6b118` with its own `bun install --frozen-lockfile`
and no uncommitted source at all. A build there rewrites **17 tracked
declaration files**. There is nothing else it could be.

Two of those 17 were listed in the first pass as another lane's uncommitted
work, and that was wrong — they are stale committed declarations too:
`code/core/helpers/types/validStyleProps.d.ts` and
`code/core/web/types/helpers/webPropsToSkip.native.d.ts`.

Separately observed in the clean room: `bun install`'s postinstall rewrites
`code/tamagui.dev/tamagui.generated.css`, a tracked file. So a fresh install
dirties the tree before anything is built. Same family, much smaller stakes.

### 2. Typecheck passes but is not checking what the source produces

`bun run typecheck` exits 0 with zero errors, and I do not believe it. It
resolves cross-package types through the tracked `types/*.d.ts` files, which
finding 1 shows are stale. A fresh build changes 14 of them. So typecheck is
validating the codebase against declarations the codebase no longer generates.

It is green. It is not evidence.

### 3. The core-web red is in-flight, not HEAD

`flatValuePrograms.web.test.tsx > geometric shorthand payloads distribute by
slot (p="4 8")` fails: `padding-right` receives `var(--t-space-4)
var(--t-space-8)` instead of `var(--t-space-8)`, so the shorthand is not
distributing across slots.

It is **not** a HEAD failure. The test does not exist at HEAD — `git show
HEAD:…` finds zero occurrences of it. It is new, uncommitted, and part of Lane
V's multi-component-payload diagnostic work, which is mid-flight. Their working
tree is red because they are still in it.

### 4. The webpack red could not be attributed, and I am not guessing

`webpack.test.tsx > 8. styleExpansions` fails: the extracted output is missing a
`_c-564548965` color program class the committed snapshot expects.

`code/compiler/static/src/compilerHost.ts` is uncommitted with +49 lines, in
exactly this area, so in-flight work is the obvious candidate. But the test file
and the snapshot are both committed, and confirming this needs the compiler at
HEAD, which needs a clean checkout. **Unverified either way.** This is the one
gate where I cannot tell you whether HEAD is green.

### 5. Several quoted baselines are obsolete because suites moved

The Tailwind suites relocated out of `core-test` into `code/core/tailwind`
(13 web files, 4 native). So:

- core native reads **176** in core-test, not the quoted 411. The missing tests
  are not lost — 271 of them are in the tailwind package now.
- core web reads 47 files, not the quoted 55.
- grammar reads **369**, not the quoted 319/322.

Nothing regressed. The numbers just stopped meaning what they meant.

### 6. A fix that exists is not in what would be pushed

The silent-failure diagnostic this lane reported earlier —
`bg="sm:green red"` parsing clean and rendering transparent with no diagnostic —
is fixed in Lane V's **uncommitted** working tree. At HEAD the silent failure
still ships.

## Replacement baseline set

The numbers every lane has been quoting are obsolete, and obsolete in the
dangerous direction: they look like regressions when read against the current
tree, so a lane that checks its work against them will either chase a
regression that never happened or accept a real one as expected.

Use these instead. They are working-tree readings taken 2026-07-30 with a fresh
build, and they are **provisional** until the clean-checkout audit replaces
them with numbers taken at a pinned SHA.

| Gate | Command | Baseline |
|---|---|---|
| grammar | `code/core/style-grammar` `bun run test` | 369 passed / 21 files |
| core web | `code/core/core-test` `bun run test:web` | 413 passed, 2 skipped, 1 todo / 47 files |
| core native | `code/core/core-test` `bun run test:native` | 176 passed, 7 expected fail, 11 skipped / 21 files |
| static | `code/compiler/static-tests` `bun run test:web` | 110 passed, 2 skipped / 14 files |
| webpack | `code/compiler/static-tests` `bun run test:webpack` | 20 tests / 1 file |
| tailwind web | `code/core/tailwind` `bun run test:web` | 459 passed / 20 files |
| tailwind native | `code/core/tailwind` `bun run test:native` | 271 passed / 4 files |
| web package types | `code/core/web` `bun run test:web` | 90 passed / 8 files, no type errors |
| typecheck | root `bun run typecheck` | exit 0 — see finding 2 before trusting it |
| lint | root `bun run lint` | exit 0, warnings only |
| frozen-lockfile | root `bun install --frozen-lockfile --dry-run` | exit 0 |

Superseded numbers, for anyone holding an old note: grammar 319/322, core web
771 / 55 files, core native 411 / 21 files. The core-web and core-native drops
are the Tailwind suites relocating into `code/core/tailwind` — 13 web files and
4 native, 730 tests between them. Nothing regressed.

## What would make this answerable

A pre-push gate reading is only meaningful against a frozen tree. Either every
lane commits and stops, and one clean run is taken; or the audit runs in a
separate checkout at the exact SHA being pushed. As long as lanes are editing,
the honest answer to "is HEAD green" is "nobody knows".
