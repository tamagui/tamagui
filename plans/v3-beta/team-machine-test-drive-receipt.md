# Team Machine GUI on Tamagui v3: light/dark test drive

Worker r18019, 2026-09-01. Branch `tamagui-v3-tip` in
`/Users/n8/.worktrees/team-machine-v3`, from team-machine main `a87d41f416`.
Migration receipt this builds on: `team-machine-migration-receipt.md` (r17281).

## Verdict

Two real theme-staleness defects, both found, both root-caused, one fixed and
proven at the pixel level. A third turned out not to be a Tamagui defect at
all, and closing it surfaced two genuine engine bugs, now fixed with tests.

1. **App code, pre-existing, not a v3 regression.** The GUI's shadow palette
   read a module global, so 20 getters kept their boot value after a theme
   change. Fixed on the branch (`98fa15707`). Web goes from up to 96% of a
   screen wrong to AE 0 on every screen and theme.
2. **react-native-web defect, surfaced through Tamagui's Dialog portal.** A
   second `useColorScheme()` subscriber inside a portal permanently loses its
   media listener. Fixed on the branch in the same commit by making the
   Provider the only subscriber.
3. **CLOSED, not Tamagui's.** The stale iOS composer menu is a UIKit `UIMenu`
   presented through zeego, and UIKit does not restyle an already-presented
   menu on an appearance change. The Tamagui native style engine is not the
   variable: the staleness reproduces unchanged with the engine off. Three
   claims in my earlier draft of this receipt were wrong; they are corrected
   under "Finding 3". Closing it did find two real `@tamagui/create-menu`
   bugs, both fixed on `v3-beta` with a failing-then-passing test: a native
   menu with no registered adapter rendered nothing at all, and a
   `Menu.Content` without a `Menu.Portal` threw on both native and web.
   Kitchen-sink's Menu usecase presents fine on iOS with no adapter
   registered, so team-machine's composer not presenting on that path is app
   composition rather than an engine defect.

The elements Nate saw not switching on beta.653.1 are explained by findings 1
and 2 on web and desktop.

## Environment

| | |
| --- | --- |
| tamagui pins | `3.0.0-beta.881.1` (11 direct pins), bumped to `3.0.0-beta.891.1`, see "Beta bump" |
| branch base | team-machine `a87d41f416`; r17281 tip `cb3e71001` |
| web | `one dev` on port 4297, Playwright chromium, fixtures via `TM_FIXTURE_ONLY=1` |
| desktop | `rngpui-service` direct spawn, Hermes bytecode bundle, window 1360x880 @2x = 4,787,200 px |
| iOS | app `dev.tamagui.agentbus.dev`, 1179x2556. r17281's build on simulator `TM-v3-r17281` `98F5F32A-8031-4233-92ED-0C81BCAA5EA8`; the engine-disabled reference on `TM-v3-r18019` `1B743D74-99AE-4ED4-BD37-3D42323D51F5`, same iPhone 16 / iOS 26.4 so frame dimensions match |
| appearance path, desktop | real macOS System Events "dark mode" toggle, host setting restored after every run |
| appearance path, iOS | `xcrun simctl ui <ud> appearance light\|dark` |
| appearance path, web | Playwright `emulateMedia({ colorScheme })`, the same `prefers-color-scheme` signal the OS appearance drives; verified by hand that it fires `matchMedia` change listeners |
| in-app theme control | none exists. The app follows the OS appearance only, so there is no second path to test. |

## Native runtime: which beds are enabled

The brief asked for enabled-vs-disabled reference captures. The answer turned
out to reshape the comparison:

- **web: structurally disabled.** `interface/platform/nativeStyleEngine.ts` is
  an empty function; web never sets an engine by construction.
- **GPUI desktop: structurally disabled.** The desktop bundler resolves
  `.desktop.*` then plain `.ts`, so the no-op installer wins. **RAN** — the
  in-tree probe reads `tm-engine=none`, and `linkNativeStyleMapping` returns
  null immediately when the engine is unset, so that is proof of zero linked
  views, not an absence argument.
- **iOS: the only enabled bed.** `nativeStyleEngine.native.ts` installs
  `@tamagui/native-registry` when the nitro module is in the binary; r17281
  measured 248 linked views there.

So web and GPUI **are** the disabled reference. Every web and desktop number
below is an engine-disabled number, and iOS carries the enabled comparison.

## Finding 1: the shadow palette module global

**Component:** every surface fed by `gui/interface/tm/style.ts`.
**Style keys:** the 20 shadow/fill getters (`cardShadow`, `menuShadow`,
`composerFill`, `sidebarHoverFill`, `focusRingShadow`, and the rest) plus
`DIALOG_SHADOW_SCHEME`.
**App code or engine:** app code. Present on team-machine main before the v3
migration; v3 exposes it rather than causing it.

Two stacked causes, both needed:

1. v3 commits a theme change to CSS variables (web) or the shadow tree
   (native) **without re-rendering the themed views** — that is the headline
   feature. `Provider` handed down an identity-stable `{children}`, so React
   bailed out of the memoized subtree and nothing re-read the global.
2. Even after adding a context subscription that forces the re-render, the
   value stayed stale. **RAN** — the React Compiler
   (`babel-plugin-react-compiler`, on via `one({ react: { compiler: true } })`)
   caches an argument-free call with an **empty dependency set**. From the
   Vite-served bundle: `if ($[20] !== selected) { t9 = selected ?
   cardShadowFocused() : cardShadow(); ... }`. The scheme is not in the
   dependency list, so the cached shadow survives forever.

**Fix:** make the scheme a real reactive *argument*. `ShadowSchemeContext` +
`useShadowScheme()` replace the module global and `setShadowScheme`; all 20
getters take `scheme: ShadowScheme` first; ~108 call sites across 32 files
pass it. Both Providers supply it from the single `useColorScheme()`.

Fixing cause 1 alone is not enough, and that is the part worth remembering:
a context subscription looks like it should work and does not, because the
compiler is memoizing one layer further in.

## Finding 2: react-native-web loses the portal's media listener

**Component:** `useDialogShadow` in `gui/interface/tm/DialogChrome.tsx:36`,
reaching `Dialog.Content` through `AdaptiveDialogBase.tsx:50`.
**Style key:** `boxShadow` from `DIALOG_SHADOW_SCHEME`.
**App code or engine:** neither — a **react-native-web** defect. It is
invisible until a second subscriber lives inside a portal.

`react-native-web`'s `useColorScheme` has **no dependency array**
(`dist/exports/useColorScheme/index.js`): `useState(Appearance.getColorScheme())`
plus `useEffect(() => { ...; return remove }, /* no deps */)`. It therefore
unsubscribes and resubscribes after **every render**, against the one
module-level `query = window.matchMedia('(prefers-color-scheme: dark)')` in
`dist/exports/Appearance/index.js`. React Native core's version passes `[]`,
so native is unaffected.

**RAN**, from the live page: `_bs-964904400` kept
`rgba(0,0,0,0.6) 0px 28px 72px -12px, ...` in both themes while the same
element's `bg` went `rgb(5,5,5)` -> `rgb(235,235,235)` and the root class went
`t_dark` -> `t_light`.
**RAN**, from a probe inside the portal: `cs: dark`, an inline copy of RNW's
exact logic also `dark`, `effects: 8 -> 9` (so the component **did** re-render),
`fired: 0`. The same probe with `[]` deps gave `fired: 1` and `inline: light`.

Cause: the Provider's listener fires first in the same dispatch; React's effect
flush then removes the dialog's listener before the dispatch reaches it, so the
portalled subscriber misses that change permanently.

**Fix:** exactly one `useColorScheme()` subscriber (the Provider), distributed
by context. `useDialogShadow` plus six more web-reachable sites moved over:
`interface/Sheet.tsx:46`, `interface/GlassFallback.tsx:10`,
`interface/tm/primitives.tsx:162`, `interface/tm/TimelineView.tsx:209`,
`interface/tm/mobile/SessionFeed.tsx:115`,
`interface/tm/mobile/TerminalScreen.tsx:70`. `.native.*` and `.desktop.*`
files keep RN core's correctly-deps'd hook and were deliberately left alone.

## Web pixel diffs

Each cell is `compare -metric AE` of a screen **booted** in a theme against the
same screen **toggled into** that theme. AE 0 means the toggled frame is
byte-identical to the fresh boot. Noise floor measured by capturing the same
state twice: **AE 0**.

| screen | theme | px | pre-fix AE (fuzz 2%) | after finding 1 | after finding 2 |
| --- | --- | ---: | ---: | ---: | ---: |
| overview | dark | 6,400,000 | 180,427 (2.82%) | 0 | **0** |
| overview | light | 6,400,000 | 574,626 (8.98%) | 0 | **0** |
| session | dark | 6,400,000 | 234,809 (3.67%) | 0 | **0** |
| session | light | 6,400,000 | 287,872 (4.50%) | 0 | **0** |
| composer | dark | 144,256 | 137,932 (95.62%) | 0 | **0** |
| composer | light | 144,256 | 138,908 (96.29%) | 0 | **0** |
| right panel | dark | 1,361,020 | 0 | 0 | **0** |
| right panel | light | 1,361,020 | 0 | 0 | **0** |
| new tab | dark | 6,400,000 | 190,249 (2.97%) | 0 | **0** |
| new tab | light | 6,400,000 | 281,162 (4.39%) | 0 | **0** |
| dialog | dark | 6,400,000 | 182,929 (2.86%) | 0 | **0** |
| dialog | light | 6,400,000 | 276,180 (4.32%) | 234,060 (3.66%) | **0** |
| settings | dark | 6,400,000 | 0 | 0 | **0** |
| settings | light | 6,400,000 | 0 | 0 | **0** |

The dialog column is the whole story of finding 2: fixing the module global
cleared every other screen and left the dialog shadow behind.

Right panel and settings measured 0 even pre-fix, so nothing visible in those
two captures depended on the stale palette.

## GPUI desktop pixel diffs

Real macOS system-appearance toggle, engine disabled (`tm-engine=none`), after
both fixes. 4,787,200 px per frame.

| screen | arm | AE | % |
| --- | --- | ---: | ---: |
| overview | toggled to dark vs fresh dark boot | 300 | 0.01% |
| overview | toggled to light vs fresh light boot | 600 | 0.01% |
| overview | round trip back to dark | 400 | 0.01% |
| overview | round trip back to light | 600 | 0.01% |
| session | toggled to dark vs fresh dark boot | 600 | 0.01% |
| session | toggled to light vs fresh light boot | 532 | 0.01% |
| session | round trip back to dark | 600 | 0.01% |
| session | round trip back to light | 600 | 0.01% |

All residual pixels are the window's rounded-corner antialiasing. Pre-fix, the
same arms were overview dark 37,108 / light 34,033 and session dark 223,259 /
light 286,356.

## Finding 3 (CLOSED, not a Tamagui defect): the iOS composer menus are UIKit

**Component:** the composer "+" menu (`ComposerPlusMenu`,
`gui/interface/tm/MobileComposerChrome.native.tsx:983`, rendered at 567) and
the "More" menu beside it.

**Cause. RAN.** `gui/setupNative.ts:11` imports `@tamagui/native/setup-zeego`,
which registers `zeego/dropdown-menu` and `zeego/context-menu` as the native
menu adapter. `withNativeMenu` returns the native component on every non-web
platform when one exists, and `createNativeMenu` maps the Tamagui menu children
onto the adapter, which is `@react-native-menu/menu`, which is a UIKit
`UIMenu`. UIKit does not restyle a menu that is already presented when the
system appearance changes. The stale popover is AppKit/UIKit behaviour, not a
Tamagui view holding a stale theme.

The probe that decided it, logged from the running app (RN `console.log` goes
to the `one dev` stdout, not `simctl log stream`):

```
[tm-probe] engine=installed menuAdapter=zeego-native
```

**The engine is not the variable. RAN.** Same bed, same script, engine install
skipped vs installed, comparing toggled-into-light against a fresh light boot
with the menu open, of 3,013,520 px:

| bed | AE | fuzz 2% | % of screen |
| --- | --- | --- | --- |
| native style engine OFF | 797,085 | 411,376 | 13.65% |
| native style engine ON | 798,889 | 413,070 | 13.71% |

**The diff is the popover and nothing else. RAN.** Measured with ImageMagick
region masks rather than by eye:

| bed | inside the menu rect | outside it |
| --- | --- | --- |
| "+" menu, rect 750x528+81+988 | 390,402 / 396,000 = **98.6%** | 16,088 / 3,013,524 = 0.53% |
| "More" menu, rect 735x705+415+1115 | 494,962 / 518,175 = **95.5%** | 40,756 / 3,013,524 = 1.35% |

The surrounding app - status bar, background, tab bar, composer - flips
correctly; only the presented popover keeps its old fill. Evidence:
`ios/finding3-plus-menu-engine-off.webp` and `ios/finding3-more-menu.webp`,
each a dark-boot | light-toggled | fresh-light-boot trio, plus
`ios/finding3-more-menu-diff.webp`.

### Three claims of mine that were wrong

- **"It is not a system UIMenu."** Wrong. I checked for `@expo/ui` and
  `setupExpoUIMenu` and stopped there, missing `setup-zeego` one line above the
  import I did read.
- **"The iOS app takes the `GorhomPortalItem` branch."** Wrong.
  `gui/setupNative.ts:10` imports `@tamagui/native/setup-teleport` and
  `react-native-teleport` is installed, so iOS runs teleport exactly as GPUI
  does. The Gorhom fallback runs in neither bed. Separately, the app's
  `<Menu.Content>` is not portalled at all: `MenuComp` and `MenuContent` contain
  no portal, only the explicit `Menu.Portal` does, and the app does not use it.
  So the whole "theme crossing a mount boundary" mechanism I described applies
  to neither menu.
- **"The native style engine is the one variable that differs."** Wrong, per the
  table above. And **"it does NOT reproduce on web or GPUI"** is unsupported for
  menus specifically: I never opened a menu on GPUI across a flip, since GPUI
  coverage was the overview and session screens.

The corrected bed comparison:

| | GPUI desktop | iOS |
| --- | --- | --- |
| native style engine | not installed | installed |
| portal backend | teleport | teleport |
| menu backend | gpui native menu adapter | zeego -> UIKit `UIMenu` |

### Two real upstream defects found while closing this

Both are in `@tamagui/create-menu`, both are fixed in `/Users/n8/tamagui` on
`v3-beta`, and each has a test that fails on the tip and passes with the fix.

**A. On native, a menu with no registered adapter rendered nothing at all.**
`withNativeMenu` chose `NativeComponent` unconditionally off web, and
`createNativeMenu`'s `lazyAdapter` returns `null` when `getNativeMenuAdapter()`
is null. An app that installs `@tamagui/menu` without an adapter therefore lost
the trigger, the content and every item, with one dev warning as the only
signal. It now reads the adapter at render time, since adapters register during
app setup, and falls back to the cross-platform component when there is none.
Test: `code/ui/components-test/MenuNoAdapter.native.test.tsx`.

**B. `Menu.Content` outside a `Menu.Portal` crashed, on native and on web.**
The portal context was created as `createStyledContext<PortalContextValue>(undefined, 'Portal')`,
so with no `Menu.Portal` above it `usePortalContext` returns `undefined` and
`const { forceMount = portalContext.forceMount }` throws
`Cannot read properties of undefined (reading 'forceMount')`. `Menu.Portal` is
optional, and team-machine's own composer menu omits it. Defaulting the context
to `{}` fixes both `MenuContent` and `MenuSubContent`.
Test: `code/ui/components-test/MenuNoPortal.web.test.tsx`.

Neither changes team-machine's behaviour as it ships today, because it does
register an adapter.

### Dropping the adapter is not a working remedy today

**RAN**, and the result is negative. With fix A copied into the worktree's
`node_modules` and the `setup-zeego` import removed, tapping the composer "+"
control opens **nothing at all** on iOS. The accessibility tree after the tap is
byte-identical to the tree before it except for live session-data churn: no menu
item appears, and the three captured frames show no popover.

So fix A restores the menu to the React tree, which
`MenuNoAdapter.native.test.tsx` proves directly, but the cross-platform Tamagui
menu does not visibly present inside team-machine's composer on iOS. Why it does
not is unexplored; it is past the boundary of finding 3 and I did not chase it.
Anyone reading fix A as "team-machine can now opt out of UIKit menus" would be
reading more into it than the evidence carries.

**A check of mine that could not fail.** The capture script asserted the menu was
open by counting accessibility rows matching `attach|draft|workflow|new session`.
That count is **3 with no menu open**, because the strings also occur in the
composer's own labels, so the assertion passed in all three frames regardless.
The whole-screen number it produced (fuzz 2% 24,278, 0.81%) is therefore the
*page* tracking the theme correctly with no menu on screen, and says nothing
about a menu. I am recording it as a discarded measurement rather than deleting
it, because the earlier zeego numbers came from the same script and the same
weak assertion; those stand only because the captured frames visibly show the
popover, which these do not.

Both worktree edits were reverted after the capture and the published
`3.0.0-beta.881.1` dist restored, so the branch is exactly as r17281 left it.

### Kitchen-sink cross-check: the no-adapter path does present

**RAN.** The same cross-platform path presents fine in kitchen-sink on the iOS
simulator at the v3-beta tip, so team-machine's composer non-presentation is app
composition, not an engine defect. I stopped chasing it there.

The check needed a correction first. Kitchen-sink *does* install a native menu
adapter: `code/kitchen-sink/index.js:5` imports
`@tamagui/native/setup-expo-ui-menu`, so the UIKit-looking popup in the default
run is `@expo/ui`'s `MenuView`, and the passing Detox suite exercises the adapter
path rather than fix A's fallback. Grepping the source for `zeego` and
`registerNativeMenuAdapter` had made me claim the opposite; a render-time probe
logging `getNativeMenuAdapter()` printed `[ks-probe] menuAdapter=installed` and
settled it.

With that import commented out the probe prints `menuAdapter=none`, and tapping
the trigger in `MenuRadioGroupCase` opens the Tamagui menu: accessibility rows
labelled exactly `Red`, `Green`, `Blue` go 0 before the tap to 3 after, the
element count goes 6 to 9, and the screenshot shows the three rows with a
checkmark on `Blue` in plain Tamagui styling rather than UIKit blur. The
0-before-tap count is the null control, on a relaunched app, so the assertion can
fail.

With the adapter left in place the existing `e2e/MenuRadioGroup.test.ts` passes
all three specs on iOS (1.0s / 4.7s / 9.4s), which covers the adapter path.
Its first run failed for an unrelated reason worth writing down: the cold Metro
bundle took 72s and the app's own fetch timed out first, showing
"Could not connect to development server" while Metro was in fact serving. One
`curl` of the bundle URL warms the cache to 90ms and the suite passes.

Both temporary edits (the `index.js` import and the probe in
`MenuRadioGroupCase.tsx`) were reverted; `git status` is clean on both.

## Click-through

**RAN** — overview, session list, an open session with transcript, composer,
right panel, new tab, settings, and the dialog, on web and on GPUI desktop. No
page errors, nothing visibly broken. Console warnings, all pre-existing and all
already named in the migration receipt except where noted:

- `React does not recognize the '%s' prop on a DOM element` — the argument
  substitution is not applied, so the prop name cannot be read from the text.
  Worth fixing at the source purely so the warning is actionable.
- `Unknown event handler property '%s'. It will be ignored. onLayout`
- `props.pointerEvents is deprecated. Use style.pointerEvents`
- `[tamagui] <Theme data-one-source=...> no longer accepts inline values` — the
  compiler's source-location prop reaching `Theme`, already filed by r17281.
- `[tamagui] "color" is a text style prop and this component is not text`
- `Warning: Missing 'Description' or 'aria-describedby={undefined}' for
  {DialogContent}` — accessibility, app-side.

No warning names a Tamagui prop reaching the DOM beyond the set the migration
receipt already lists.

## GPUI conformance suite

**RAN**, 24 of 82 checks sampled: **14 pass, 10 fail**. All 10 failures
reproduce at the pre-migration baseline `cb3e710012` in a separate checkout
(`/tmp/sweep-base.txt`), so none is a v3 regression: new-tab
(`TypeError: sessions.filter is not a function`), diff (Flow parse),
stage-surface, overview-grid, primitives, pane-focus, glass, dialog-animation,
and three that fail only in the base checkout because `RNGPUI_LOCAL` points
elsewhere.

**Correction to an earlier claim of mine:** I previously reported all 24 checks
exiting 0. That was wrong. The sweep captured `out=$(cmd | tail -3); code=$?`,
which reads `tail`'s exit status, not the command's. The 14/10 split above is
the real result.

## Coverage gaps, stated honestly

- **Gallery overlay: not covered on web.** There are no image fixtures in
  `features/tm/`, `ComposerAttachments` has no path that opens the overlay, and
  the overlay itself uses only theme tokens. I could not reach the state, so I
  am not claiming it.
- **Menus were never opened on GPUI across a flip.** GPUI coverage was the
  overview and session screens, so my earlier "finding 3 does not reproduce on
  GPUI" was unsupported for menus specifically. It is moot now that the cause
  is UIKit, but the gap is real: no bed exercised a GPUI menu across a scheme
  change.
- **iOS screens covered:** session feed and the composer menu. The connect
  sheet and settings were not driven; the session-row taps did not land by
  label or by coordinate, and I stopped rather than spend the budget there,
  since the brief puts web and GPUI first.
- **No test was added for findings 1 and 2**, because neither lives in the
  Tamagui engine: one is an app module global and one is a react-native-web
  hook. The existing `system-appearance-conformance` check boots at the host
  scheme and asserts once, so it structurally cannot catch a *toggle* defect;
  a toggling variant is the check that would have caught all three, and is
  worth adding to team-machine.

## Evidence

`plans/v3-beta/team-machine-test-drive-evidence/`, webp quality 90, no
downscale.

- `web-before/` — the ten pre-fix boot-vs-toggled diff images (red = changed).
- `web-after/` — post-fix boot/toggled pairs for overview, session, dialog.
- `gpui/` — all six boot/toggled/returned frames per screen, plus diffs.
- `ios/` — feed and menu captures plus their diff images.
  `finding3-plus-menu-engine-off.webp` and `finding3-more-menu.webp` are the
  dark-boot | light-toggled | fresh-light-boot trios that localise finding 3 to
  the popover, and `finding3-fallback-menu.webp` is the discarded no-adapter
  trio, kept because it shows the absent menu the text describes.
  `finding-ios-menu-sidebyside.webp` is the original symptom capture.
  `kitchensink-menu-adapter.webp` and `kitchensink-menu-no-adapter.webp` are
  the kitchen-sink cross-check: the `@expo/ui` popup and the Tamagui menu the
  same usecase presents once the adapter import is removed.

## Commits

| repo | sha | what |
| --- | --- | --- |
| team-machine `tamagui-v3-tip` | `98fa15707` | `fix(gui): thread the light/dark scheme through the shadow palette instead of a module global` — findings 1 and 2 |
| tamagui `v3-beta` | `dce5caf065` | `fix(create-menu): fall back to the cross-platform menu with no native adapter, and make Menu.Portal optional again` — the two upstream defects under finding 3, with `MenuNoAdapter.native.test.tsx` and `MenuNoPortal.web.test.tsx` |

Neither is pushed. Root `bun run lint` and `bun run check` are green with both in
the tree; `code/ui/components-test` passes 15 files / 34 tests native and 12
files / 55 tests web.
