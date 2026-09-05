# V3 launch review and stabilization record

Started September 4, 2026 against `origin/v3-beta` at
`110ae39aaa740131da19084c8788ae31620755b0`. This is an assessment of the release
candidate, with a bounded homepage pass and measured engineering work. It is
not a claim that every historical plan has been revalidated.

## My assessment

The direction is strong enough to launch. I would stop adding major features.
The important improvements reinforce each other: semantic HTML on the web,
native primitives on native, explicit styling frontends, one conditional value
grammar, app-owned skins, named control sizes, and a compiler that can resolve
more real application code. V3 has a clearer reason to exist than another
incremental styled-component release.

The work still feels complicated from the outside because several migrations
arrive together. A user can change packages, component imports, tokens,
conditional values, variants, transitions, and config defaults in one upgrade.
Each change can be defensible while the combined experience is exhausting.
The launch should optimize for the first successful screen, not for explaining
every architectural improvement on the first page.

My strongest recommendation is to present one path for new apps and a separate,
conservative path for existing apps. For existing apps, keep Config v5 while
migrating the API, then evaluate v6 separately. The upgrade guide already says
this; make it a prominent promise rather than a detail people discover late.

### What I particularly like

| Change | Why it improves the product | What needs care |
| --- | --- | --- |
| `html.*` primitives | Familiar semantics without giving up native rendering. A good entry point for web-heavy applications such as Soot. | Web form behavior does not automatically exist on native. Document the exact mappings and rejected cases. |
| Named control sizes | `sm`, `md`, and `lg` describe a control, while numeric tokens describe a scale. Text plus padding is a better foundation than a magic height ramp. | Config v5 and v6 intentionally produce different physical sizes. Custom fonts and icon-only controls need visual checks. |
| Style pieces, `styled.dynamic`, and `.resolve()` | Explicit composition and resolution provide more useful compiler boundaries than overloaded legacy variants. | Teach the simple case first. Do not make every button example an engine tutorial. |
| Flat conditional values | Responsive and interaction styles are concise, and the shared grammar gives tooling a common contract. | Discoverability, diagnostics, migration of complex objects, and escaping remain part of the feature. |
| Behavior, skins, and generated copies | Users can own appearance without forking behavior. This is a compelling answer to design-system customization. | The names and import examples must make the choice obvious. Verify that importing a skin never mutates the behavior export. |
| Rust-backed analysis | A substantially better foundation for parsing and semantic analysis. | JavaScript work around the analyzer can still dominate. Measure complete transformations and incremental rebuilds. |
| Recent Select, Adapt, and token-domain fixes | These close visible problems in actual interactions rather than just improving abstractions. | Retest combinations: RTL, scrolling, nested adaptation, first mount, and theme changes. |
| Smaller website dependency graph | The recent removal of unused themes and eager auth/store imports is valuable. | Preserve these savings while restoring visual identity. |

### What looks incomplete

1. **A single current release narrative.** `docs/v3-beta-state-of-the-release.md`
   is dated July 19. Its compiler, sizing, packaging, and performance sections
   describe earlier states. The August readiness and fluid-sizing proposals
   also contain decisions superseded by September work. Historical reports are
   useful evidence, but cannot all be treated as current instructions.
2. **Public performance claims need matching evidence.** The September runtime
   corpus receipt reports V3 faster overall while clause strings remain slower
   than the V2 control. That is a useful result; it does not support "faster in
   every case." Rust parsing speed is likewise not total compiler speed.
3. **The size target has moved.** The styled-view ledger's headline records the
   earlier 27.00 kB result; later entries accept growth for variant resolution,
   correctness fixes, and other features. The September 3 measurement is
   28,797 gzip-9 bytes, below a 28,821-byte ceiling. Launch copy should use a
   current, reproducible artifact and explain what it includes.
4. **Sizing fallback did not match the approved contract.** An unknown name
   returned zero font/icon metrics and undefined frame tokens instead of the
   configured default. Existing unit tests did not cover that case. This pass
   adds a regression test and a bounded fallback, including invalid defaults.
5. **Compiler searches did redundant work after Rust analysis.** Definition
   normalization searched the entire AST to rediscover declaration parents
   already exposed by the analyzer. `findAstNode` kept traversing after a hit.
   This pass removes that work and checks binding semantics.
6. **The homepage lacked product evidence and hierarchy.** The original 160px
   duck, centered text block, pill installer, and immediate footer made the
   framework feel less substantial than its actual capabilities.
7. **Consumer migration is a separate acceptance gate.** Soot already has a
   remote migration branch. That is useful inventory, not evidence that its
   current UI is ready to switch. Bento and generated starter claims also need
   to name the exact consumer commit that was tested.

## What a good launch should contain

- One small working example that a visitor can understand immediately.
- A new-app path with one recommended config and one recommended component
  surface, plus a clear route to the alternatives.
- A V2 upgrade path that keeps existing tokens/themes initially, runs the
  codemod, explains the manual review tail, and ends with real screen checks.
- A concise breaking-change summary linked to the full guide.
- Performance evidence with source SHA, runtime, fixture, cold/warm distinction,
  raw samples, bundle composition, and the cases that did not improve.
- A visible beta feedback path asking for a minimal reproduction, platform,
  animation driver, compiler state, and exact package versions.
- A release candidate whose build, packed exports, starter, docs, web, and
  native results refer to the same assembled source revision.

I would defer another grammar redesign, a new browser-floor policy, or a
wholesale replacement of floating positioning until after this launch. Those
are large changes in user expectations and deserve their own acceptance work.

## Sizing: the current state

The source of truth for the new contract is
`plans/v3-beta/named-sizes.md` and `code/core/size/src/index.ts`. The old
`v3-sized-components-too-short.md` describes the failure that led here; its
control-ramp solution is no longer the API.

### The three meanings of size

| Input | Controls | Shapes |
| --- | --- | --- |
| omitted / `true` | The name in `config.sizes.default`, normally `md`. | Follow the shape's own variant defaults. |
| `xs sm md lg xl` | A recipe of font, padding, radius, gap, and optional icon tokens. | Avatar maps named sizes to the recipe's control height. |
| `"4"` / `"$4"` | One key into each scale, retaining V2 token semantics. Frame uses `minHeight`, without the named-size vertical padding. | The configured size token. |
| numeric `44` | Development diagnostic; fall back to the default control size. | Literal dimensions remain supported where the shape API accepts them. |

`resolveSize` returns `frame`, `text`, `icon`, `controlHeight`, `name`, and
`fontSizeKey`. Named frames do not set a fixed height. The nominal control
height is line-height plus twice the vertical padding; borders are additional.
Consumers use the returned dimensions differently: a text button spreads the
frame, an icon-only toggle uses a square, and a checkbox uses the icon metric.

### Config v6 expected dimensions

| Size | Font / line-height | Vertical padding | Nominal height | Bordered Button/Input/Select | Icon |
| --- | --- | --- | --- | --- | --- |
| xs | 12 / 16 | 4 | 24 | 26 | 12 |
| sm | 14 / 20 | 6 | 32 | 34 | 16 |
| md | 14 / 20 | 8 | 36 | 38 | 16 |
| lg | 16 / 24 | 8 | 40 | 42 | 16 |
| xl | 18 / 28 | 10 | 48 | 50 | 20 |

These are the explicit expectations in `ControlSizes.test.tsx`. A token-key
size of `4` under Config v6 still means a 16px minimum frame; it is not a
request for the default named control. This distinction must stay visible in
the upgrade guide and in examples.

Config v5 supplies its own recipes using numeric font and token keys. The
website deliberately keeps those v5 scales, so its physical dimensions should
not be compared to the v6 table without accounting for the config.

### Font and fallback concerns

- The resolver uses the requested component font when it has the recipe key,
  otherwise `fonts.body`. Recent custom-font changes add the type-scale keys
  required by named recipes. Check custom family and weight combinations.
- Default icon sizing rounds font size up to a four-pixel grid for names;
  token-key sizing keeps the font size itself.
- A malformed name must not silently collapse a control. The new regression
  covers missing names, numeric controls, custom defaults, and an invalid
  default that would otherwise invite recursive fallback. Token-key defaults and
  malformed null recipes are covered too.
- Text scaling, long translated labels, multiline buttons, larger custom
  line-heights, and native hit targets remain visual acceptance cases. A
  named-size unit test cannot prove any of them.
- The approved design does not imply that an `xs` checkbox has a large touch
  target. Visual size and hit area should be assessed separately on devices.

### Fluid and unit cleanup

Do not implement the August fluid-sizing proposal verbatim. Later commits
already added `fluid()`, clamp/unit resolution, and native style filtering
(`fdd45decf4`, `ed1560e0e3`). The earlier proposal explicitly rejected some of
that behavior. Any follow-up must begin with the current implementation and
tests, especially the documented arithmetic limits, viewport updates, and
font-scale behavior.

## Homepage: three bounded visual passes

Scope is the homepage and its homepage-only install control. Existing branding,
system fonts, header, footer, and small initial dependency graph remain useful
constraints.

1. **Composition.** Reduce the duck from 160px to 48px. Establish a compact
   brand line, a stronger two-line heading, readable supporting text, primary
   action, and a small HTML example. Use two columns at desktop and a single
   column on mobile. Inspect both rendered views.
2. **Detail.** Add restrained syntax color and a thin yellow accent. Tighten
   mobile spacing, replace the heavy installer pill with a simple code control,
   and make the visible command match the copied command. Inspect desktop,
   mobile, and dark rendering.
3. **Finish.** Resolve contrast and responsive details found in the second
   pass, check keyboard/copy/navigation behavior, and retain final screenshots.

The site's breakpoint names need special attention: `md` means max-width 1020
in the site config, whereas Config v6 uses min-width names. Homepage responsive
styles use the site's explicit `gtMd` convention.

## Performance work and evidence

### Compiler declaration lookup

The analyzer exposes `Module.parentOf(node)`. Definition normalization formerly
walked the whole module to identify a variable's declarator and its enclosing
`const` declaration. Doing this for many bindings repeatedly decoded and
visited unrelated nodes. The change uses the supplied parent links and keeps
the same conservative behavior for mutable variables, non-variable symbols,
and destructuring. General AST search now returns immediately after its first
match, without reading unused children or later siblings.

Focused measurement, one 500-binding module, three warmups and nine measured
rounds, Bun 1.4.0, same generated source and checksum:

| Operation | Before median | After median |
| --- | --- | --- |
| Look up all initializer spans | 2,151.20 ms | 1.03 ms |
| Resolve all binding definitions | 4,889.14 ms | 1.35 ms |

This deliberately exposes the repeated-search cost. It is not a representative
application build and must not be quoted as overall compiler acceleration.
Source-range lookups also prune subtrees that cannot contain the requested span.
The regression compares bounded lookup with exhaustive traversal across every
span in representative TSX, including Unicode and shared wrapper spans.

A broader synthetic fixture includes Rust parsing/linking, JSX normalization, and
expression evaluation: three modules, 100 components, three warmups, seven
measured rounds, Node 24.16.0. The final reproducible run fell from **522.58 ms to 4.07 ms**;
evaluated-output SHA-256 is identical. This fixture still stresses repeated
binding lookup. It excludes bundler startup, filesystem discovery, CSS lowering,
and application dependency loading, so it is not an overall build-speed claim.

Raw evidence: [lookup before](assets/v3-launch-2026-09-04/compiler-before.json),
[lookup after](assets/v3-launch-2026-09-04/compiler-after.json),
[graph before](assets/v3-launch-2026-09-04/compiler-graph-before.json),
[graph after](assets/v3-launch-2026-09-04/compiler-graph-after.json), and the
[final combined graph receipt](assets/v3-launch-2026-09-04/compiler-graph-reproducible.json).
The final pass also avoids decoding ignored AST metadata such as comments and
tokens. Reproduce the graph comparison without changing the working tree:

```sh
node code/comparisons/bench-compiler-graph.mts --base=110ae39aaa
```

Use the pinned Node from `.node-version`. The baseline arm reads compiler-core
source from the requested git commit and both arms share installed dependencies.

### Core runtime

The initial production Chromium profile uses the existing `profile-hotpath.ts`
tool, clause-string scenario, scale 200, 30 iterations. It reports a 4.4ms
median mount, 7.0ms median update, and approximately 15,362 sampled allocation
bytes per render. CPU attribution puts `getSplitStyles` well ahead of the
clause scanner. Value resolution, property emission, and style contribution
are useful targets. These are local diagnostic numbers, not release claims.

The September corpus receipt remains the broader baseline: 8,948 elements,
V3/V2 total ratio 0.79, clause strings 1.22, conditional objects 1.28. The
14-element conditional-object subgroup is especially small. Do not read that
row as a stable estimate for all application code.

The first retained runtime change removes two per-value emission closures and
shares string/unit resolution. An alternating after/before/before/after run of
the existing clause-string profiler (40 iterations per arm) measured:

| Arm | Mount median | Update median | Sampled allocation bytes/render |
| --- | --- | --- | --- |
| After A | 5.5 ms | 8.4 ms | 14,800.7 |
| Before A | 5.5 ms | 8.5 ms | 15,359.0 |
| Before B | 5.3 ms | 8.1 ms | 15,327.7 |
| After B | 4.0 ms | 5.9 ms | 14,888.9 |

The allocation reduction is about 499 bytes/render, or 3.25%. Timing varies too
much to support a reliable speedup claim. The styled-view fixture fell from
76,820 raw / 28,800 gzip-9 bytes to 76,790 / 28,790 on pinned Node 24.16.0: a
10-byte gzip reduction, without changing the 28,821-byte ceiling. These are the
first-pass numbers.

Two further retained changes skip cache setup for font properties that are
never cached and share numeric conversion across ordinary values and transforms.
The numeric helper avoids duplicate conversion and finite-number checks. Six
regression cases and an independent 152-input comparison cover fractions,
scientific notation, whitespace, invalid suffixes, and non-finite values.

The final styled fixture is **76,614 raw / 28,732 gzip-9 bytes**, a **68-byte gzip
reduction** from this session's 28,800-byte starting artifact. The 28,821-byte
ceiling and recorded baseline were not changed. This is smaller than the
0.5–4 kB opportunity the owner hoped might exist; it is the measured retained
result, with no feature removal. The [final size receipt](assets/v3-launch-2026-09-04/core-web-size-final.json)
records both the session baseline and the older ledger baseline. The owner clarified that **only web bundle size
is an optimization target**. Native correctness remains a validation requirement.

An optional-frontend traversal experiment reduced this fixture by 159 gzip bytes,
but the first candidate's CI showed the Metro **web** starter island growing from
367,022 to 367,156 bytes. That experiment was reverted. Class traversal and
frontend descriptors retain their original structure. Astra also caught a Unicode
class-name boundary regression in that experiment; its focused regression test
is retained even though the implementation was reverted.

Interleaved after/before/before/after class-renderer checks covered ordinary,
owned, composed, and mixed raw classes, with a separate typography scenario for
the font-cache cleanup: 3,000 renders per sample, three warmups and seven measured
samples per case. Serialized outputs matched across every arm. Timing varied and
did not establish an additional speedup. Raw `frontend-*.json` receipts document
the rejected experiment; `font-*.json` receipts measure the incremental cache
change on that experimental base. Neither represents a final retained timing claim.

The size resolver also shares one validity predicate across a bounded fallback
loop: authored name, configured default, then token `4`. This removes duplicate
checks, preserves valid token/font defaults, and handles a malformed null recipe.
The loop has no recursion and emits at most one development warning.

The [four raw profiles](assets/v3-launch-2026-09-04/) identify the source baseline
as `110ae39aaa`; the after arms include the changes committed in `6378b814c9`.
No fixture or production feature was removed to produce this result.

Any retained runtime change must preserve the one-pass contract, reduce actual
work, pass web/native behavior tests, and include a rebuilt bundle measurement.
Avoid buying a tiny timing movement with a large new cache or more per-render
allocation.

## Soot integration readiness

Read-only inspection found `origin/v3` in `~/soot`, with migration commits and
a latest inspected beta pin of `3.0.0-beta.917.1` (`9a16a0dfd9`). The main
checkout still uses the V2-family `2.7.7-1788328229285` pin and contains unrelated
ongoing work. No Soot files are changed by this stabilization pass.

Existing migration history includes flat-value conversion, removed-API
migration, and a Sprout runtime verification commit. This confirms work exists;
it does not establish current mergeability, completeness, or visual parity.

Recommended sequence when V3 is stable:

1. Refresh the branch comparison against current Soot main. Inventory its
   migration commits and preserve useful work instead of rerunning a codemod
   blindly over already converted files.
2. Pin the exact validated Tamagui beta across root catalog, nested packages,
   native fixtures, and lockfile. Check for mixed versions and duplicate core
   instances before chasing visual failures.
3. Keep Soot's current tokens/themes initially. Take API migration and v6 scale
   adoption as separate reviewable steps.
4. Move ordinary web layout, text, and native-compatible controls toward
   `html.*`. Keep behavior components for menus, dialogs, selection, and focus
   contracts. Do not mechanically replace a behavior component with its visual
   HTML equivalent.
5. Validate browser semantics: forms, links, labels, text selection, focus,
   keyboard shortcuts, drag/drop, scrolling, and portal placement. On native,
   test the supported mapping and the explicit unsupported-element diagnostics.
6. Evaluate Tailwind mode on one representative screen only after API parity.
   Compare readability, conversion burden, extraction, startup bytes, and both
   platform renders. Tailwind adoption is a decision, not a prerequisite.
7. Manually cover Soot's tiling/workspace shell, editors, dialogs, data views,
   authentication, and native Sprout surfaces. Record light/dark and narrow/wide
   screenshots at the exact dependency pin.

## Release state and final validation

At the starting SHA, GitHub reports successful Checks (`33830067967`), Registry
(`33830067979`), Detox (`33830068164`), and Maestro (`33830068195`) runs. Later
skipped runs also exist at the same SHA; they do not replace these successes.
`origin/main` is an ancestor of the inspected candidate. PR #4124 is the existing
V3-to-main integration PR.

The Release workflow is active and automatically publishes after successful
push-triggered Checks on `v3-beta`. The earlier readiness report describing it
as disabled is stale. Updating that branch is therefore a publication action,
not just a branch push. Complete and push the topic branch, attach concrete
validation, and obtain the owner confirmation required by AGENTS.md before
crossing that boundary. Do not silently disable or alter release infrastructure.

## Production issues found during the visual pass

Rendered HTML alone concealed two functional failures. The Vite SVG alias chose
the linked package's CJS entry, so browser hydration failed on a named `Circle`
import. The alias now chooses the package's ESM entry. The homepage also used
non-anchor elements behind links; its destinations now render real anchors.
Two toast containers produced duplicate copy notifications; the site layout now
uses the existing root container.

A full production browser navigation then exposed duplicate `loader` exports in
generated docs data modules. One 1.25.13 explicitly supports inline loader
declarations, while the twelve styled/unstyled/Tailwind route modules re-exported
them. Those routes now declare small forwarding functions and keep shared page
implementations outside the route tree. The styled UI route also supplies the
page's default export. No dependency patch was required.

The default local Bento checkout still imports a removed V3 hook. An isolated
checkout at the Dockerfile's pinned Bento SHA
`50432b85cc47de443b640bee0bcf5decd119231e`, resolving this worktree's dependencies,
produced **883 static pages** successfully. The existing Bento checkout and Soot
checkout were not changed.

Final production screenshots: [desktop](assets/v3-launch-2026-09-04/production-desktop.png),
[mobile](assets/v3-launch-2026-09-04/production-mobile.png),
[dark](assets/v3-launch-2026-09-04/production-dark.png).
The [browser receipt](assets/v3-launch-2026-09-04/home-verification.json) checks
hydration, keyboard clipboard use, five internal destinations, client navigation,
and no horizontal overflow at 320, 390, 768, 1024, and 1440px.

## Overnight continuation

The owner requested further size reduction, even modest wins, and explicit staged
agent upgrade guidance. The CLI prompt, copy-paste briefs, upgrade guide, and
upgrade skill now identify **V3 APIs with existing design values** as a complete
checkpoint. Config v5 remains supported; the v6 palette/recipe conversion moves
to a separately requested follow-up. CLI tests validate the staged guidance, including the older V1 entry path.

The September 3 sizing plan retains a derived `controlHeight`, distinct from the
deleted fixed control ramp. Its consumers include circular buttons, toggles,
shapes, token helpers, and browser-native select sizing. The owner's follow-up
left retaining it open; the current recommendation is to derive it from the
selected font and padding, keep literal shape tokens literal, and avoid another
independent scale. No removal has been implemented.

After the difficult engineering work, the owner requested a Fable-medium review,
then Astra-medium final review. Fable is not exposed in this session's tools, so
the root agent handled the continuation and Astra medium performed an independent
technical review. It found the Unicode class-name boundary
regression in the subsequently rejected frontend experiment and no blocking issue
in the retained numeric conversion or final bounded sizing fallback.
The review requested final rebuilt tests and mirrored docs navigation checks.

Validation for this pass is recorded below as it completes. A starting-candidate
CI success is not evidence for the later edits.

- Full root build: 171 packages successful, including rebuilt reverse dependencies.
- Root lint and workspace checks passed; the fresh worktree needed a second frozen
  install after building to create the CLI bin link. The root style-vocabulary
  check skips when no root config artifact is present.
- Root lint and workspace checks passed again after the retained numeric
  conversion and bounded size fallback; final typecheck is tracked with the PR checks.
- Core web: 624 passed, 3 skipped. A heavily parallel run first hit two timing
  limits; an isolated full rerun passed without changing the tests.
- Core native: 339 passed, 7 expected failures, 9 skipped.
- Compiler web: 267 passed, 2 skipped; webpack: 20 passed.
- Compiler native: 109 passed, 1 expected failure.
- Tailwind web/native: 733 / 460 passed, including the retained Unicode class regression.
- UI component web/native: 56 / 38 passed.
- Size regression: two red cases before the fix, 9 tests green afterwards.
  The final bounded-loop version also passed all 9 tests and 5 control-size
  browser checks against the rebuilt kitchen sink.
- Vite plugin: 17 passed.
- Site unit tests: 62 passed.
- Site production Playwright: 11 docs mode checks and 5 homepage checks passed, including document-marker assertions for Tailwind and unstyled client navigation.
- Kitchen-sink: 5 named-size checks and 17 conditional/theme/group/Select/Adapt
  browser checks passed. A final CSS transition pass added 7 passing checks, with 2 existing skips.
- CLI migration prompt: 3 tests passed, including separation of required work
  from the optional v6 color remap.
- Production API authentication is not validated locally: required Supabase and
  Postmark environment settings are absent. This does not affect the recorded
  public-page checks.
- Final production build: 883 static pages, using the Dockerfile-pinned Bento checkout.
- Final pinned-Node styled-view gate: 28,732 gzip bytes; unchanged ceiling 28,821.
- Full CI-equivalent workspace web run: 166 successful tasks. Native correctness
  run: 118 successful tasks. These include cached unchanged package prerequisites.
- Zero-runtime starter: all six browser bundle gates passed on pinned Node without
  changing any baseline or tolerance. Twelve browser checks passed across Vite,
  webpack, and Metro web, including themes and loading an interactive island.
- Independent Astra-medium technical review: no blocking findings in retained
  changes, including the final bounded size fallback. Fable was unavailable; the
  root agent handled continuation.

### Topic PR and CI corrections

[PR #4205](https://github.com/tamagui/tamagui/pull/4205) targets `v3-beta`. The first
pushed candidate passed web integration shards, WebKit, grammar, checks, SSR
hydration, the zero-runtime fixture, and Registry. Two checks exposed follow-up
work: compiler/runtime edits had made DOM parity source citations stale, and the
optional frontend experiment increased the Metro web starter island. Citations
now point to the actual final symbols; the frontend experiment was reverted.
Numeric and size-fallback simplifications retain smaller web bundles.

Final source is being submitted for a new exact-revision CI run. Local validation
and the earlier candidate's successful jobs do not substitute for that run.
Updating `v3-beta` crosses the npm publication boundary and still needs the
owner's explicit confirmation. Main integration remains PR #4124.
