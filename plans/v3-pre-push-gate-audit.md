# Pre-push gate audit

Run by Lane D, 2026-07-30, before pushing the v3-beta branch.

The question asked was: does every gate we quote actually measure what we think
it does, at HEAD, from a clean state?

**Answer, in two passes.** The first pass, in the shared checkout, found that
the answer was no — not because the gates are wrong, but because nothing was
measuring HEAD, and because a real blocker was hiding behind a green typecheck.
The second pass, in an isolated worktree at a pinned SHA after that blocker was
fixed, found **HEAD green on every gate**.

Read the clean-checkout section for the numbers that count. The shared-checkout
sections are kept because they are how the blocker was found and they document
what a reading taken in a live tree is and is not worth.

## Pass one: the conditions the shared-checkout reading ran under

- HEAD at start: `34d3585056`. HEAD at finish: `50c48899ac`. It advanced by one
  commit mid-audit.
- Tracked files modified but uncommitted: **34 at the start, 42 at the finish**.
  Two were staged in the index at one point and committed before I could read
  them.
- So a gate reading taken now describes neither HEAD nor any state that will
  exist again. What gets pushed is HEAD; nobody has measured HEAD.

That is what pass one established. Pass two removed the ambiguity.

## Pass one numbers, and what each one was actually measuring

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
declarations but not the downstream UI packages'.

**Correction, after Lane E rebuilt by discovery.** The file count was right and
the interpretation was too broad — mine and the manager's both. The components
that actually lost a capability are the ones exposing the style surface
directly: `Input`, `TextArea`, `Sheet` and their variants. `Dialog`,
`AlertDialog`, `Checkbox`, `Switch`, `RadioGroup`, `Spinner`, `Tooltip` and
`Field` show no `FlatStyleValue` **by design** — they `Omit` the style props
entirely, being behavioral wrappers over a styled frame, and their declarations
changed only by gaining `container` and `containerName` to their
key-*exclusion* unions. They were never admitting style props at all, flat or
otherwise. "Most of the component library publishes prop types missing the
headline feature" was wrong; "the components that take style props did" is
right.

The lesson worth keeping is not the count but the shape: a stale declaration
that *contradicts* a new type errors loudly and gets fixed, while one that
merely *omits* a capability compiles fine and says nothing. Only the loud half
had been caught.

This is the one finding I would have held the push for. **It is now fixed** —
see the clean-checkout section: a build at `09e25611ca` rewrites no declaration
at all.

**Confirmed in a clean room, 2026-07-30.** The above was measured in the shared
tree, where uncommitted work is a competing explanation. So it was re-run in an
isolated worktree at `a37ac6b118` with its own `bun install --frozen-lockfile`
and no uncommitted source at all. A build there rewrites **17 tracked
declaration files**. There is nothing else it could be.

Two of those 17 were listed in the first pass as another lane's uncommitted
work, and that was wrong — they are stale committed declarations too:
`code/core/helpers/types/validStyleProps.d.ts` and
`code/core/web/types/helpers/webPropsToSkip.native.d.ts`.

### `tamagui.generated.css` was never another session's work

Observed in the clean room: `bun install`'s postinstall rewrites
`code/tamagui.dev/tamagui.generated.css`, a tracked file. A fresh checkout with
a fresh install is dirty before anything is built.

This one is worth naming because the fleet has been misreading it all session.
It was reported at the start as an unrelated session's uncommitted work and
treated as untouchable ever since — every lane has been carefully stepping
around a file that nobody was editing. It was the install.

The general form: a clean checkout and a clean `git status` are not the same
thing in this repo. Anything automating a pre-push check needs to know which
tracked files the install and build legitimately rewrite, or it will read them
as someone's work in progress.

### 2. Typecheck passes but is not checking what the source produces (pass one)

`bun run typecheck` exits 0 with zero errors, and I do not believe it. It
resolves cross-package types through the tracked `types/*.d.ts` files, which
finding 1 shows are stale. A fresh build changes 14 of them. So typecheck is
validating the codebase against declarations the codebase no longer generates.

It is green. It is not evidence.

**Resolved at `09e25611ca`** — once the declarations are real, typecheck exits 0
against declarations a build reproduces. Same exit code, different meaning.

### 3. The core-web red is in-flight, not HEAD (confirmed)

`flatValuePrograms.web.test.tsx > geometric shorthand payloads distribute by
slot (p="4 8")` fails: `padding-right` receives `var(--t-space-4)
var(--t-space-8)` instead of `var(--t-space-8)`, so the shorthand is not
distributing across slots.

It is **not** a HEAD failure. The test does not exist at HEAD — `git show
HEAD:…` finds zero occurrences of it. It is new, uncommitted, and part of Lane
V's multi-component-payload diagnostic work, which is mid-flight. Their working
tree is red because they are still in it.

**Confirmed at `09e25611ca`**: 414 passed, zero failures. The test is absent, so
the attribution held.

### 4. The webpack red could not be attributed (now settled)

`webpack.test.tsx > 8. styleExpansions` fails: the extracted output is missing a
`_c-564548965` color program class the committed snapshot expects.

`code/compiler/static/src/compilerHost.ts` is uncommitted with +49 lines, in
exactly this area, so in-flight work is the obvious candidate. But the test file
and the snapshot are both committed, and confirming this needs the compiler at
HEAD, which needs a clean checkout. **Unverified either way.** This is the one
gate where I cannot tell you whether HEAD is green.

**Settled at `09e25611ca`**: 20 passed / 20. Green, measured in the clean room
rather than taken from the fixing lane's own working-tree report.

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

## The clean-checkout audit — `09e25611ca`

Run with `scripts/gate-audit.sh 09e25611ca`: a detached worktree at that exact
commit, its own `bun install --frozen-lockfile`, its own build, nothing else
touching it. **This is the first reading in this campaign that measures a
commit rather than a moving working tree.**

**HEAD is green.**

| Gate | Exit | Result |
|---|---|---|
| post-build dirty | — | **1 file**, and it is only the postinstall CSS. **Zero declarations rewritten.** |
| frozen-lockfile | 0 | — |
| lint | 0 | warnings only |
| typecheck | 0 | 0 errors (76s) |
| grammar | 0 | 369 passed / 21 files |
| core web | 0 | 414 passed, 2 skipped, 1 todo / 47 files |
| core native | 0 | 177 passed, 7 expected fail, 11 skipped / 21 files |
| static | 0 | 110 passed, 2 skipped / 14 files |
| webpack | 0 | 20 passed / 20 |
| tailwind web | 0 | 459 passed / 20 files |
| tailwind native | 0 | 271 passed / 4 files |
| web package types | 0 | 90 passed / 8 files, no type errors |

### What the clean room settled

1. **The stale-declaration blocker is closed.** A build at this SHA rewrites no
   tracked declaration at all. Finding 1 is resolved, verified independently of
   the lane that fixed it.
2. **Typecheck is a gate again.** It still exits 0, but now it resolves against
   declarations a build reproduces, so the pass means something. Previously it
   was green while validating the codebase against declarations the codebase no
   longer generated. Same exit code, completely different weight of evidence.
3. **The core-web red was in-flight, as attributed.** It is absent here: 414
   passed and zero failures, against a working-tree reading of 413 passed and
   one failure. The failing test genuinely does not exist at this commit.
4. **Webpack `styleExpansions` is green at this SHA** — 20/20, measured rather
   than taken from the fixing lane's own working-tree report.

### Not covered by this run

`code/tests/integration`'s playwright suite is outside the gate set the script
runs, because it needs dev and preview servers. Its known red — a Tailwind
`@container grid` element computing `display: flex` — was not exercised here,
so treat it as unmeasured at this SHA rather than passing. It is separately
attributed to cascade-layer semantics and recorded under the blocked D3
decision.

### One bug in the audit script itself, found and fixed

The `static` gate first reported `exit=1` in 1 second. That was the script, not
the gate: the glob was quoted, so it reached vitest as a literal filter and
matched no files. Re-run unquoted it is 110 passed / 14 files. The script is
fixed. Worth recording because a gate that exits non-zero for a harness reason
is the same class of problem this whole audit is about — it was only obvious
because 1 second is impossibly fast for that suite.

## Re-run at the tip — `4fdcd94500`

Four commits past the first audited SHA, taken with the shared tree fully clean
for the first time all session. Same script, same isolation.

**All eleven gates green. One number moved.**

| Gate | `09e25611ca` | `4fdcd94500` |
|---|---|---|
| post-build dirty | 1 (postinstall CSS only) | 1 (postinstall CSS only) |
| frozen-lockfile / lint / typecheck | 0 / 0 / 0 | 0 / 0 / 0 |
| grammar | 369 / 21 files | 369 / 21 files |
| core web | 414 / 47 files | 414 / 47 files |
| core native | 177 + 7 expected fail | 177 + 7 expected fail |
| static | 110 / 14 files | 110 / 14 files |
| webpack | 20 / 20 | 20 / 20 |
| tailwind web | 459 / 20 files | **460** / 20 files |
| tailwind native | 271 / 4 files | 271 / 4 files |
| web package types | 90 / 8 files | 90 / 8 files |

The single delta is tailwind web +1, which is `9a3895e635` adding the
malformed-arbitrary diagnostic test. Everything else is byte-identical across
four commits. Nothing regressed.

### But the native suite is order-dependent, and the gate cannot see it

Core native reads 177 green in the fixed order, which is what was asked. That
answer is true and it is not sufficient, because the suite runs in one order
every time and an order-dependent failure is invisible to it by construction.

Running the same suite with `--sequence.shuffle`:

- **1 failure in 8 shuffled runs**, plus another in an earlier set of 3.
- The failure is
  `safeAreaVariables.native.test.tsx > ordinary components never read or
  subscribe to the safe-area store`.
- `TypeError: Cannot read properties of undefined (reading 'listeners')` —
  the test reads `globalState.__tamagui_safe_area_subscription` and it does not
  exist yet.
- The file **passes alone** (3 passed) and **passes in the default order**. So
  it is not a broken test in isolation; it is a specific interaction with what
  runs before it.

**Correction (2026-07-31): it is not seed-deterministic, and I reported that it
was.** The seed failed on both attempts in the audit worktree, and I generalised
from two consecutive reproductions in one environment. It does not hold: in the
shared checkout at the same source, after a fresh build, that seed passes 3 of 3
and six further random shuffles also pass — nine clean runs against eleven runs
in the worktree that produced two failures.

So the ordering failure is real and was observed with a concrete, specific
error, but the trigger is not the shuffle seed. Something environment-dependent
— worker scheduling or which files share a worker — decides it, which is why a
seed reproduces within one checkout and not across them. Treat the command below
as the shape of the reproduction rather than a guaranteed one:

```
cd code/core/core-test
TAMAGUI_TARGET=native npx vitest --run \
  --config ../../packages/vite-plugin-internal/src/vite.config.ts \
  --sequence.shuffle --sequence.seed=1785470380788 *.native.test.tsx
```

That makes it investigable, not guaranteed. Whoever picks it up should expect to
have to hunt for the ordering rather than replay a seed.

This lands in `925e338d2f`, the safe-area commit that moved setup out of module
load and removed two production module-load captures. Removing those captures
is the right change. The open question, which is not this lane's to settle, is
whether the test's assumption that the subscription global already exists is
now stale, or whether the runtime should be creating it lazily and is not.
Either way the evidence for that commit was a working-tree reading in fixed
order, which is exactly the reading that cannot show this.

**The general point for the gate set:** every suite here runs in one fixed
order. That makes them reproducible, which is good, and blind to ordering bugs,
which is not. A periodic shuffled run is cheap — three seconds for core native
— and is the only thing that would have surfaced this.

## Replacement baseline set

The numbers every lane has been quoting are obsolete, and obsolete in the
dangerous direction: they look like regressions when read against the current
tree, so a lane that checks its work against them will either chase a
regression that never happened or accept a real one as expected.

These are the clean-checkout numbers at `09e25611ca`, not working-tree
readings. They supersede everything quoted before today.

| Gate | Command | Baseline |
|---|---|---|
| grammar | `code/core/style-grammar` `bun run test` | 369 passed / 21 files |
| core web | `code/core/core-test` `bun run test:web` | 414 passed, 2 skipped, 1 todo / 47 files |
| core native | `code/core/core-test` `bun run test:native` | 177 passed, 7 expected fail, 11 skipped / 21 files |
| static | `code/compiler/static-tests` `bun run test:web` | 110 passed, 2 skipped / 14 files |
| webpack | `code/compiler/static-tests` `bun run test:webpack` | 20 passed / 1 file |
| tailwind web | `code/core/tailwind` `bun run test:web` | 459 passed / 20 files |
| tailwind native | `code/core/tailwind` `bun run test:native` | 271 passed / 4 files |
| web package types | `code/core/web` `bun run test:web` | 90 passed / 8 files, no type errors |
| typecheck | root `bun run typecheck` | exit 0, 0 errors — trustworthy again as of this SHA |
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
