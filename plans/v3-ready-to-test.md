# Tamagui V3 beta ready-to-test procedure

This is the local browser acceptance path for `v3-beta`. It does not publish a
package, create a tag, move an npm dist-tag, deploy, or run a release script.

## Start from a fresh shell

Open a new terminal. Run these commands exactly:

```sh
cd /Users/n8/.worktrees/tamagui-v3-flat

git branch --show-current
git rev-parse HEAD
git status --short

bun install --frozen-lockfile
bun run build
bunx tsc --noEmit -p code/kitchen-sink/tsconfig.json

lsof -nP -iTCP:7979 -sTCP:LISTEN

cd code/kitchen-sink
bun run start:web
```

The branch command must print `v3-beta`. Record the SHA and any status output.
A dirty checkout tests its complete working tree, so it cannot be reported as a
test of the printed SHA alone.

The install, root build, and kitchen-sink typecheck must all exit zero. A
successful typecheck normally prints no output.

The `lsof` command should print nothing. If another process owns port 7979, stop
that specific process before continuing. Leave `bun run start:web` running. It
is ready when the terminal prints both of these lines:

```text
[tamagui] built config, components, prompt
webpack 5.108.4 compiled successfully
```

The webpack version may move. A successful compile and the absence of an error
overlay are the required signals.

In a second terminal, open the focused V3 page:

```sh
open 'http://localhost:7979/?test=V3BetaReadyToTestCase&animationDriver=css'
```

The bare `http://localhost:7979/` URL opens the general Sandbox. There is no
use-case menu on that page, so use the complete query URL above.

## What to test

### 1. Flat value strings

The first row contains one red rounded tile and one green rounded tile.

1. Hover the red tile. It must become blue immediately.
2. Move the pointer away. It must return to red.
3. Hover the green tile. It must become blue, then return to green when the
   pointer leaves. The later `bg="green"` replaces only the base clause from
   `backgroundColor="red hover:blue"`; the inherited hover clause survives.
   Wiping the inherited condition would require restating it in the later
   contribution, for example `bg="green hover:green"`.

At a wide viewport the first tile has 18px computed padding. This comes from
the kitchen-sink token and media config, not a hard-coded CSS value.

### 2. Tailwind class strings

The Tailwind tile is red at half opacity with a 12px radius and 18px padding.
It is rendered by `View` from `@tamagui/tailwind` using this string:

```text
w-[160px] md:w-[240px] h-[96px] p-4 rounded-[12px] bg-[red] hover:bg-[blue] opacity-50 hover:opacity-100
```

1. Hover the tile. It must become solid blue.
2. Move away. It must return to half-opacity red.
3. Resize the browser above 1020px. Its width must be 160px.
4. Resize to 1020px or below. Its width must be 240px.

This proves that the package-selected Tailwind frontend tokenizes known
candidates, evaluates conditions, and reaches the shared Tamagui renderer.

### 3. Transitions

The last tile starts red, 160px wide, with 7px padding and an 8px radius. Its
transition targets include configured shorthands (`bg`, `p`, `rounded`) and a
longhand (`width`). The tile does nothing on hover; use the button for every
step below.

1. Click **Toggle transition**. Over 300ms the tile must turn green, grow to
   320px, increase to 32px padding, and round to a 48px radius.
2. Click again. Every property must animate back to the initial state.
3. Click once more, then click again before 300ms elapses. The motion must
   reverse from its current intermediate value. It must not snap to either end.

In browser devtools the computed transition should name the CSS properties,
including `background-color`, `padding`, `width`, and `border-radius`. Seeing
authored names such as `bg` or `rounded` in computed CSS is a failure.

## Finish and report

Stop the dev server with Ctrl-C. Record:

- the Git SHA and whether the checkout was dirty;
- browser name and version;
- pass or failure for all three sections;
- console errors, failed network requests, and any webpack overlay;
- a screenshot at a wide viewport;
- for a failure, the smallest reproduction plus the dev-server and browser logs.

## Native validation status

The acceptance page and the three behavior checks above are registered only for
web. Run that web path when testing behavior, and treat native behavior as
unverified for this cycle.

The native evidence established this cycle is limited to build and unit-level
reachability:

- the native optimizer pre-step passes with 14 optimized modules against a
  minimum of 8 after the export-resolution fix;
- the core-test native unit suite passes all 198 tests;
- a clean Debug build completed in 572 seconds, then installed and launched on
  an iPhone 16 simulator running iOS 26.5.

Before any future native probe, prove that the rebuilt native artifact contains
the current source change. A successful build exit code is insufficient because
stale dist output can survive an exit-zero build. For a `propMapper.native`
change, run this from the repository root and replace the example search term
with a symbol or string unique to the source change under test:

```sh
(
  cd code/core/web
  bun run build
)
rg -n 'DISTINCTIVE_CURRENT_SOURCE_SYMBOL' code/core/web/dist/esm/helpers/propMapper.native.js
```

Run the native probe only after `rg` finds that symbol in the exact built file
loaded by the native export condition. Web probes can import current source from
`../web/src`, while a native import from `@tamagui/core` resolves to built dist.
When web passes and native fails, check module resolution and built-artifact
freshness first. Report a platform divergence only after proving the native
artifact is current.

No native behavioral assertion completed. The Detox run reached a launched app
and was deliberately stopped before assertions to free the machine. The
semantic UI snapshot helper daemon also failed to auto-start. These are resource
and test-reachability limits, not a failed assertion or a discovered native
defect.

Flat value strings, Tailwind class strings, container-only layout responses,
and CSS transition-string motion therefore remain unproven on native. CSS
transition values are checked against the native capability matrix and then
dropped because no native driver consumes the transition IR yet; native apps
must use an animation-driver preset. The flat-value defect currently under fix
reproduces on native as well as web.

## Known limitations and scope

- `bun run start:web` sets `DISABLE_EXTRACTION=true`. This page proves the web
  runtime against rebuilt workspace packages. It does not prove compiler
  extraction, production minification, SSR hydration, or bundle size.
- The kitchen-sink uses webpack. Its Tailwind section proves only
  Tamagui-owned candidates. Unknown classes are intentionally preserved for the
  official Tailwind engine and will not gain CSS here. Test that path in a Vite
  consumer configured with `@tamagui/tailwind/vite`.
- The kitchen-sink combines its legacy V3 media table with V4 additions. Its
  `md` condition is `maxWidth: 1020`, which is why the Tailwind tile grows on the
  narrower viewport. The V6 default config uses mobile-first `md` at
  `minWidth: 768`; this page does not redefine that default.
- Config-first numeric strings use the active token scale. In this app `p-4`
  computes to 18px, and the regular `rounded="12"` resolves the configured
  radius token. Bracketed `rounded-[12px]` is the literal 12px Tailwind form.
- `@tamagui/tailwind` currently exposes a plain `className?: string` type.
  Runtime correctness here does not imply complete static class-name
  autocomplete or rejection of every invalid candidate.
- A root install can rewrite the tracked
  `code/tamagui.dev/tamagui.generated.css` file during postinstall. The final
  conformance audit accepts that one generated rewrite and no declaration-file
  rewrites.
- A running dev server keeps package code in memory. After rebuilding or
  replacing package output, stop and restart the server before reporting a
  result.
- This manual page is one acceptance layer. The isolated matrix in
  `plans/v3-final-conformance-matrix.md`, kitchen-sink Playwright, SSR hydration,
  and CI bundle comparison remain separate gates. A pass here does not turn an
  unrun gate into a pass.

## Verification record

The focused page was exercised in headless Chromium 145.0.7632.6 from a fresh
shell on 2026-07-31. Runtime code and package manifests matched candidate
`8ebfb5abe01eeca85c2a99cb2b01b3791c70d76c`; only this procedure and unrelated
untracked lane artifacts were present. The frozen install completed without
lockfile changes, the root build completed 168 tasks in 31.9 seconds, and the
kitchen-sink typecheck exited zero. A new server then compiled in 23.0 seconds.
Browser-computed results were:

- flat value: red to blue on hover, 18px padding, and a green base with its
  inherited blue hover clause retained;
- Tailwind: red at 0.5 opacity to blue at 1, 160px wide above the configured
  `md` condition and 240px within it;
- transition: intermediate values were observed in both directions after an
  interruption, then returned exactly to red, 160px, 7px padding, and 8px
  radius;
- zero browser console errors, zero page errors, and zero HTTP responses at
  status 400 or higher.
