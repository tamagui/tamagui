v3 release plan:

> **2026-07-18: beta-exit status and open work now live in
> `plans/v3-beta-campaign-plan.md` (single source, includes the decisions log).**
> This file remains for the release-command reference, migration notes, and the
> long-tail backlog; its "active work" / "open decisions" sections may lag.

## cutting a beta (verified July 2026)

From the v3-beta branch, with a clean tree and CI green on the pushed HEAD:

```
bun ./scripts/release.ts --beta --force-publish-all
```

Run it interactively (not `--ci`): coming from stable 2.4.6 the beta base is
ambiguous, so pick `3.0.0-beta.0 (next major)` at the prompt. `computePublishTag`
maps `3.0.0-beta.x` to the npm dist-tag `beta` automatically; it cannot land on
`latest`. `--force-publish-all` matters for the first beta: without it,
`skipPublishIfUnchanged` packages resolve dep versions via `npm view <pkg>
dist-tags.beta`, which doesn't exist yet, and dependents would reference
never-published versions. Preconditions: `git fetch origin --tags` (baseline
detection picks the newest v* tag vs canary commit), npm login + a 2FA code,
and nothing uncommitted anywhere (the finish step runs `git add -A`). The
script runs check/lint/typecheck/tests/build itself, then publishes ~160
packages, commits the version bump, tags `v3.0.0-beta.0`, and pushes the
branch + tag. `--dry-run` prints the plan without writing.

## landed on v3-beta (July 2026)

- deprecated API removals: `focusable` => `tabIndex`, `fullscreen`, `styleable`, forwardRef wrappers, `inlineWhenUnflattened`, ui-kit aliases, true tokens (default size resolves to `$4`), platform style key renames, createSystemFont moved to its own package
- SSR-safe inverse sub-themes: `inverse` is a built-in sub-theme now, old themeInverse path gone
- composable structure audit: ListItem alignment, Select dead-code sweep + Select.Separator, FocusScope (display:contents wrapper, render-prop removed, new `noFocus` zero-focus mode threaded through Dialog/Popover/Select), Dialog (dead-code sweep, RemoveScroll gated to open modal dialogs, parts own presence, driver-level `onDidAnimate` completion), Sheet (scoped context, Frame => Container + Background split with codemod, Overlay must be direct child)
- Adapt live slot core + dialog<->sheet handoff (exit animations play through media flips)
- notable fixes along the way: boolean size-shorthand tokens inside variant styles, animated-driver custom component preservation (render-as-string clobbering), slider visible track/fill, dialog exit releases pointer-events locks (body lock, overlay, focus trap)
- icons: sizing now defaults to font sizes instead of size tokens (`themed()` resolves token sizes via the current font's `font.size[token]` scale, so icons line up with text at every size), and `usePropsAndStyle` was removed from `themed()` (icons now resolve theme color/fill/stroke via `useTheme()` and build a minimal style object instead of running full style resolution on every render)
- token stepping removed from default component styling: `@tamagui/get-token`'s `getSize`/`getSpace`/`getRadius` are now trivial same-key token resolvers (token in, Variable out). The runtime scale-sorting stepper (`stepTokenUpOrDown` / `getTokenRelative`, plus the `shift`/`bounds`/`excludeHalfSteps` options) is gone — it sorted the config's token scale at runtime and stepped up/down by index, which was unpredictable with custom configs. Components that stepped a token down now multiply the resolved numeric size value instead (input padding, list-item/select-label paddingVertical, select-native paddingVertical, popper arrow, slider thumb, tooltip content padding), with per-site constants tuned to match the previous default-config output within ~1-2px. "One size smaller" token-key lookups (list-item subtitle font, tooltip default size) use the new `oneSizeTokenSmaller`, which just decrements the `$N` key.

migration notes so far:

- Dialog.Content no longer accepts the no-op `size` variant from DialogContentFrame, narrowing the public prop type.
- non-modal Dialog.Content no longer enables RemoveScroll while open, so non-modal dialogs no longer lock page scroll.
- FocusScope no longer supports function-as-children/render-prop; pass JSX children directly.
- Select's unused `name` and `autoComplete` props were removed; they never backed form or autofill behavior.
- Sheet.Frame => Sheet.Container + Sheet.Background (codemod: scripts/codemods/sheet-frame-to-container.js). Container no longer clips with overflow hidden. Sheet.Overlay must be a direct child of Sheet.
- icon token sizes now resolve through the current font's size scale (`font.size[token]`) rather than the `size` token scale, so e.g. `<Icon size="$4" />` matches `$4` text instead of the `$4` space/size value. Raw numeric sizes are unchanged.
- icon components no longer accept media/pseudo props directly (e.g. `$sm`, `hoverStyle`) — `themed()` dropped `usePropsAndStyle` and no longer runs full style resolution. Wrap an icon in a styled `View` if you need responsive/pseudo styling around it. Color/fill/stroke theme tokens, `size`, `strokeWidth`, `style`, and `testID` still work as before.
- `@tamagui/get-token` public API removal: `stepTokenUpOrDown` and its alias `getTokenRelative` are gone, and `getSize` / `getSpace` / `getRadius` no longer accept the second options argument (`shift` / `bounds` / `excludeHalfSteps`). They now take a single token and return that token's Variable, resolving `true` to the default size and looking up cross-scale by the same key. Replace shifted lookups with arithmetic on the resolved numeric value (e.g. `getVariableValue(getSize(size)) * n`). `createCheckbox`'s `sizeAdjust` prop was also removed (it relied on token stepping).
- font size semantics settled: a raw **number** font size is the multiplier / platform-default-lineHeight path (a direct numeric `fontSize` sets the literal size and leaves lineHeight to the platform — landed earlier), while a **"Npx" string** (e.g. `"17px"`, or `fontSize="17px"`) means an exact pixel value. Px strings are first-class literals — never token keys, no lineHeight auto-derivation: web passes them through as CSS, native parses them to the number, and a token authored as a px string is normalized to its number with a `needsPx` flag at creation. The v5 config font `size` + `lineHeight` scales are now pinned to px strings, so v5 behavior is exactly the previous numbers (verified identical computed styles); v6 will redefine the number scales aligned to tailwind.

## active work (v3-gating)

- landed: ScrollView ejected from react-native on web — clean-room WebScrollView in @tamagui/scroll-view mapping the used RN surface (scrollTo/scrollToEnd/getScrollableNode, RN-shaped onScroll, contentContainerStyle, horizontal, indicators); react-native-web-lite re-exports it (its 900-line legacy implementation deleted). Input was already web-native. migration note: on web via lite, ScrollView props outside the mapped subset (momentum events, snapTo*, keyboardDismissMode) are no longer supported.
- open: decide whether lite's TextInput should also move into @tamagui/input as a web TextInput export (nothing in tamagui consumes it; tamagui Input is the replacement — left in lite for now)
- props-consistency pass across components: align how Dialog/Popover/Select/Tooltip/Toast handle portals, focus props, scoping, and naming (Dialog + Sheet are the cleaned-up reference now)
  - landed: Popover + Select adapt handoff migrated off the legacy `SheetController` + `PopoverAdaptHiddenContext` pattern to the same AdaptParent `open`/`onOpenChange` + `adaptContext.targetFullyHidden` mechanism Dialog uses post-#4099. open state lifted above `AdaptParent` in both; adapted sheet body now persists through the slide-out and unmounts only after the handoff reports the exit (covered by PopoverAdaptSheetUnmount + new SelectAdaptSheetUnmount tests on css+native). Removed `PopoverSheetController`/`useShowPopoverSheet`/`PopoverAdaptHiddenContext` and `SelectSheetController`/`useSelectBreakpointActive`.
  - landed: `Select.Content` now threads `onEscapeKeyDown` + `onInteractOutside` (composes `onPointerDownOutside`/`onFocusOutside` with its forced preventDefault) for Dialog/Popover dismissable parity.
  - landed: `forceMount` on `Popover.Content` (Dialog semantics: disables part-presence gating, keeps children mounted).
  - landed: data-state open/closed on `Select.Trigger` and the Select viewport (web) to match Dialog/Popover; Tooltip inherits via Popover parts.
  - not done: unifying the internal `ScopedProps` type-shape (popover/tooltip use `Omit<P,'scope'> & {scope?}`, dialog/select/toast use `P & {scope?}`) — cosmetic rename with type-churn risk and no correctness value, left as-is. Toast light-touch scoping/naming not revisited.
- iOS CI: clear stale queued macOS runs, fix runner availability so Detox/Maestro actually run per-push
- animation API lane H (plans/v3-animation-api.md) in execution: H0 public hooks + H3 real css animated number first (feature branches off v3-beta, land in beta.1), then H1 onTransition, then H2 sheet position/opacity removal with the C2 skin
- v2 deprecation sweep (tracked, not started): full review of every prop/API v3 changed, backported as `@deprecated` JSDoc on main so v2 users get editor warnings before upgrading. Source list = the migration notes above plus: `disableTransparencyHide` (v3 replaces transparency hiding with display-none hiding, successor `disableHideWhenClosed`), `onDidAnimate` and Sheet `onAnimationComplete` (v3: `onTransition`), `Sheet.Frame` (v3: Container + Background), get-token steppers (`stepTokenUpOrDown`/`getTokenRelative`/options arg), icon media/pseudo props. Do on main, not v3-beta.

## open decisions (not currently being executed)

- theme model
  - remove component themes / remove `name` from `styled()` (or just make not theme-related)
  - component example just show using theme="surface1" for example
  - maybe make theme builder have easy "inverse" option so accent can be something else
  - ~~`$backgroundActive` no longer exists in v3 themes but is still referenced by checkbox/switch checked states, tabs active, and toggle-group active (silently no-ops).~~ resolved: migrated all four to `$backgroundPress` (matching the slider fix), regression-tested in kitchen-sink `ActiveStateBackground.test.tsx`
- update button a bit to how i do them
- consider removing or simplifying `ThemeableStack` / `SizableStack`
- simplify Select/ListItem further where it directly helps perf or API clarity
- Adapt render callback public API: render callback that lets you decide how to render given the resolved typed props; de-couple native integrations to `@tamagui/sheet/adapt-to-[some-native-library]` exports

## deferred / post-v3 unless revisited

- compound variants?
- simplify functional variants
- conditional values or value objects
- see v3 cleanups
- native can have a non-signal mode for faster initial render
- activeStyle
- remove the flat mode we spiked in tw branch
- style improvements of some sort:
  - light-dark() support
  - css if functions of some sort
  - bringing back some sort of "flat-mode" for tamagui
    - bg="ios:light(red) dark(blue)"
    - boxShadow="dark(0 0 10px $shadow5)"
    - green-red-blue(#xxx, $some, $thing)
    - light-dark(hover-press($red2, $red3), hover-press($red3, $red2))

---

# compiler improvements (updated June 2026)

5-scenario bench (500 components simple/rich/group, 150 heavy, Chromium, 1 run):

| scenario        | compiled           | baseline | nativewind v5 | uniwind |
| --------------- | ------------------ | -------- | ------------- | ------- |
| simple mount    | 7.2ms              | 7.1ms    | 18.1ms (2.5x) | 23.1ms  |
| rich mount      | 7.2ms              | 6.4ms    | 14.1ms (2.2x) | 17.5ms  |
| **group hover** | **396ms (19.4x!)** | 20.4ms   | 52.6ms (2.6x) | 59.8ms  |
| **heavy page**  | **148ms (13.6x!)** | 10.9ms   | 33.4ms (3.1x) | 39.7ms  |
| animated spring | 35.5ms (4.9x)      | 7.3ms    | 14.5ms (2.0x) | 6.5ms   |

**priority 1 - group styles compiler optimization (19x slowdown is the biggest issue)**:

- `group` prop and `$group-*-*` children are ALL in deoptProps → compiler bails out the entire tree
- 500 group items × ~3 children = 1500 TamaguiComponent instances all running full getSplitStyles
- goal: compile group parent to a div with data-group attribute; compile children's $group-\* styles
  to CSS :has([data-group]) selectors on web; preserve group JS emitter only for native
- location: createExtractor.ts deoptProps (line 1088-1109), extractToClassNames.ts
- estimated improvement: group mount 396ms → ~20ms (matching inline JS hover)

**priority 2 - heavy/dynamic props partial compilation**:

- `width={80 + ((i * 17) % 60)}` dynamic values prevent extraction of ANY styles
- even fully static siblings of a dynamic prop don't get extracted
- goal: extract the static props that ARE constant, leave only the dynamic ones as style={}
- location: createExtractor.ts ~line 1200-1400 (per-prop static evaluation + batching)
- estimated improvement: heavy page 148ms → ~25ms

Implementation constraint (July 2026): the shared lowerer may partially extract
only direct components with no runtime defaults, default variants, compound
variants, base style, or base atomic class (the normal case is `View`/`Text`),
and only when normalized emitted CSS properties are disjoint from every
retained dynamic prop. Ownership is derived through
`getSplitStyles`, including transform aliases and logical-property expansion;
canonical CSS shorthand/longhand conflicts and direction-dependent logical
property conflicts are checked after normalization. Raw prop-name families
are not sufficient. Styled components remain on the
runtime path because removing an authored override while retaining styled
defaults leaves equal-specificity atomic classes whose winner depends on
stylesheet insertion order. Spreads, `style`, caller `className`, variants,
pseudos, media, group, and theme-sensitive candidates remain conservative.

**priority 3 - animated spring (was previously highest priority)**:

- the previous benchmark reported 35.5ms (4.9x vs baseline), but used the removed
  `animation` prop; rerun it with v3 `transition` before treating that number as evidence
- lower priority than group because NativeWind also struggles here (14.5ms, 2x baseline)
  and animated components are less common than group/dynamic in real apps
- goal: partial extraction of static props even when the `transition` prop is present
- estimated improvement: 35.5ms → ~12ms

Blocked on a runtime/compiler handshake. The v3 public prop is `transition`,
not legacy `animation`. A compiler-only class extraction is safe for the CSS
driver but is not an input to RN Animated/Reanimated/Motion: those drivers
consume resolved inline style and can replace the class-backed `viewProps.style`
after hydration. Until the retained runtime component can import compiler-owned
style values into every driver's input, all `transition`, `animateOnly`,
`animatePresence`, `animatedBy`, `enterStyle`, and `exitStyle` candidates stay
byte-identical on the runtime path. The follow-up must define one driver-neutral
style payload, merge it before `useAnimations`, and prove CSS, RN Animated,
Reanimated, and Motion runtime parity before re-enabling partial extraction.
The comparison benchmark must migrate from `animation` to `transition` before
it can serve as P3 performance evidence.

coverage note: Tamagui has 79 fully cross-platform utilities vs NativeWind 74
(group/container queries ARE cross-platform in Tamagui via JS state emitter on native)
but group compile deopt completely negates this advantage for group-heavy UIs

---

vite 8 monorepo fix:

- added `tamagui-monorepo-exports-fix` plugin to `@tamagui/vite-plugin`
- vite 8 (rolldown) resolves workspace subpath imports to filesystem dirs instead of package.json exports
- see https://github.com/vitejs/vite/issues/11676 and https://github.com/vitejs/vite/issues/20390
- also adds ssr.optimizeDeps.include for @tamagui/web, @tamagui/core, tamagui to avoid duplicate instances
- only active in monorepos (detected via workspace: protocol in deps)
- can be removed once vite fixes upstream

---

before v2 final:

- // import '@tamagui/native/setup-safe-area'

- activeStyle / accept not taking shorthands
  - wait on Switch.Thumb is is oppsoite

- accept type not looking right?

---

can be after v2 final

- Dialog API cleanup: modal={false} + Overlay should just work without forceMount, and exit animations should work without Portal. Users shouldn't need Portal/forceMount for basic non-modal dialogs with overlays. Currently without Portal there's no AnimatePresence lifecycle so enterStyle/exitStyle don't animate - content just stays mounted. Dialog.Content/Overlay should handle their own presence animation when not inside Portal.

<Popover.Content
onInteractOutside={close}
not working
and cant put another View next to Content and have it show

- its beta - motion has a ton of hacks, but also dont forget:
  const animateKey = JSON.stringify(style)

- RN animation driver perf: remove useMemo, diff style in layout effect only (not render) for concurrent mode safety. compute diff in render (pure, read-only), apply + update refs in effect. only create/update Animated.Values for changed keys instead of re-processing all keys every render.

- /Users/n8/tamagui/code/core/web/src/helpers/defaultAnimationDriver.tsx
  - should just be native on native, css on web? use platfomr extensions

- split input/textinput into SizableTextInput / SizableInput or not?
  - otherwise its annoying af if you want your OWN size

- fullscreen prop deprecated, use `inset: 0, position: 'absolute'` instead

- Sheet scope prop (like Dialog/Popover/Tooltip have)

- @tamagui/web can just merge into core, .native paths are perfectly fine since we build separate so no need to serapte.

- reanimated on native - no transitino can still avoidReRenders just set duration: 0 timing, should be faster

- css driver can avoidReRenders
  - reanimated too but requires testing native + worklets

- Text weirdness fixes (explore)
  - remove suppressHighlighting / margin 0 default from Text
  - fix display: inline issue
  - see what react-strict-dom is doing
  - move it to <div><span> where div is flex, span is text only props
      <div {...nonTextStyleProps}>
        <span {...textStylePropsOnly} style={{ display: 'contents' }}>

        </span>

      </div>

- smaller bugfixes/things to check work:
  - ensure onlyAllowShorthands changes types properly
  - tooltip: expects zIndex but shorthand overrides and doesn't work
  - small bug, circular prop https://x.com/flexbox_/status/1907415294047379748
  - fix toggle / multiple https://github.com/tamagui/tamagui/pull/3362
  - seems <Switch checked defaultChecked> isnt showing in the checked position

- option for compiler to optimize $theme-, $platform-, $group- media values (currently bails from optimization)
  - useTheme().x.val may have bug on light/dark switch
  - react native 78 dialogs not working
    - https://discord.com/channels/909986013848412191/1354084025895227423/1354084025895227423

- could make option automaticlaly handle overshootClamping just by esimtating length of animations and converting to timing?

- enter/exit in media not overriding

- Checkbox disabled prop not disabling on native

- if Popover can not be portaled that would be useful for some use cases

- RadioGroup.Indicator can't use AnimatePresence i think because .styleable()
  - styleable shouldn't probably do anything with presence because the child should expect to handle that, at least need to double check taht

- bug: if you name a file `polyfill-native.ts` tamagui-build doesnt output the .native files properly

- When using <Adapt.Contents /> inside an Adapt when="maxMd" it seems to hide the children before fully closed
  - https://uniswapteam.slack.com/archives/C07AHFK2QRK/p1723409606028379

- When opening a fit Sheet while keyboard is active (at least on ios) the height of the sheet is off
  - https://uniswapteam.slack.com/archives/C07AHFK2QRK/p1723475036176189

- AnimatePresence leaving things in DOM
  - https://uniswapteam.slack.com/archives/C07AHFK2QRK/p1723148309745679

---

# v3 cleanups

- var(--)
- may want to align flexShrink = 1 by default to align with web default?
- styleable shouldnt forwardRef, remove it in general
- Sheet API cleanup: stop pretending all subcomponents render where authored when `Sheet.Overlay` is actually hoisted out of the animated container
  - target shape:
    `Sheet`
    `  Sheet.Handle`
    `  Sheet.Container`
    `    Sheet.Background`
    `  Sheet.Overlay`
  - rationale: `Sheet` owns the actual animated wrapper; `Handle`/`Frame` currently render inline but `Overlay` is special-cased through context for legacy child ordering
  - likely major / breaking since current JSX implies a flatter child model
- remove inlineWhenUnflattened i think
- basically we need a style() helper because:
  - then we can pre-compile styles like text defaults, view default, text-nested default
  - then we can get rid of defaultProps
  - then get rid of expensive statiConfig.defaultProps merging every render
- always dynamic optimize no need for special "components"
- remove getToken + shift weirdness in general
- react compiler on internals / concurrent friendly internals
- eject from floating-ui if possible (its huge)
- drop rnw support / setupReactNative.ts

---

- MCP works w your local tamagui config?

- perf: could avoid even creating style rules, easy / big win:
  - note that in addStyleToInsertRules it checks if shouldInsert
  - note that we create all the style rules before we actually check if should insert
  - refactor: not _super_ simple in that the check may need to happen inside getStylesAtomic for example and it also needs to check the startedUnhydrated, so just need to refactor a bit so we have a "shouldInsert" a the top of getSplitStyles properly set up, then we can maybe pass to getStylesAtomic and anywhere ebfore we actually create the rulestoinsert

- import `tamagui/styled` / `@tamagui/button/styled`
  - adds styles, sizing, unstyled prop
    - removing default size based styling, look at this in tooltip!:

```
const padding = !props.unstyled
        ? (props.padding ??
          props.size ??
          popperSize ??
          getSize('$true', {
            shift: -2,
          }))
        : undefined
```

- checkbox disableActiveTheme not workign
- ssr fix i think select not showing value until after load?

animations improvements:

- make tamagui package work in some simple way
  - probably making tamagui + tamagui/ui both work is fine

- react-native-web-lite
  - tree shakeable, smaller, fixes things like data- attributes not passing
  - shares core style logic with tamagui for smaller bundles used together
  - outstanding bug? https://discord.com/channels/909986013848412191/1354817119233118288/1354839267771285546

- docs on reprop context on ios new arch

- in SheetImplCustom bad logic for pulling up when scroll view inside
  - if scrollview isn't able to scroll we shouldn't disable that behavior:
    `if (scrollEnabled.current && hasScrollView.current && isDraggingUp) {`
    - we can: pass in scrollable node selector
    - do logic to determine if its actually scrollable

- apply visibility hidden to fully hidden popover for perf gains

- refresh site hero:
  - 100% features work the same cross-platform
  - optionally compile-time optimized, but 100% runtime feature-set
  - 0-dependency: no / faster than react-native-web
  - fully typesafe styling
  - by far best SSR
  - headless component kit
  - super-powerful: themes, animations

---

- popover bring back dismissable - document dismissable etc

- escape on tamagui sheet doesn't close in general keyboard accessibility
  - check radix sheet and compare and improve

- announcement

- group props require the prop key to be stable like animations
  - saves 2 hooks in every component
  - in dev mode add a extra component around every component
    - make it so it automatically handles animation/group changes without breaking
    - but make it error in the console

- issue with letter spacing after upgrading
  - https://discord.com/channels/909986013848412191/974145843919716412/1356379335132446740
  - https://share.cleanshot.com/4rKTYFkl

v6 config:

- flex shorthand is wrong in v5 config - it maps flex => flexGrow, but flex is really more like a variant (flex: 1 sets flexGrow/flexShrink/flexBasis)
  - change flexGrow shorthand to `grow`
  - need globalVariants concept to handle flex properly
  - breaking change, so v6 config

v3:

- aim for fast follow
- remove component themes, instead theme="surface2" etc
- remove `name` from styled()
- remove inverse in favor of sub-themes that can inverse already ssr safe
- naming:
  - themes => variables, control any property
  - remove tokens in favor of variables

- RSD - no View + Text (just Element and we can extend it later)
  - compiler can optimize
  - mimic text inhertance on native (or remove it on web)
  - https://github.com/facebook/react-strict-dom/blob/429e2fe1cb9370c59378d9ba1f4a40676bef7555/packages/react-strict-dom/src/native/modules/createStrictDOMComponent.js#L529

- todo:
  - remove $true tokens and concept
  - createStyledContext should be react compiler friendly and avoid mutating Context, just have another separate hook or soemthing.
  - remove themeBuilder from plugins in favor of just using ENV to tree shake
  - remove all theme css scanning stuff to separate optional package
  - remove componentName, just allow setting default theme: ""
  - remove builders like themebuilder etc from config
    - do it via plugins automatically
  - inlineProps => `accept: 'number' | 'string' | value<type>()`
  - remove inlineProps, usedKeys, partial extraction

  - must pass in colors separately but it exports the defaults still
  - createSystemFont into package
  - remove component themes by default instead just do:
    - "surface1-3" and have components use that instead of name by default when not unstyled
  - theme inverse only works with sub-themes named \_inverse. createThemes.generateInverseSubThemes: boolean
    - v4 config can add a boolean to do this by default
    <!-- - button-next is mostly ready now to replace button:
    - remove old button, move new button into place, fix issues around the site/bento
    - docs update: we should show "headless" style and non-headless
      - <Button.Frame><Button.Icon></Button.Icon></Button.Frame> for headless
      - <Button> for non-headless -->
  - input-next
    - rather than wrapping react-native-web we implement our own
    - keep it simple, align to web props as much as possible
    <!-- - swap image-next => image -->
  - make sure webContainerType is "right" - probably not `normal` default (currently `inline-size`)
  - we should fix "tag" and have it so you can pass typed props to the tag
    - tag => as?
    - tag={['a', { href: '' }]}
  - we may need to move the web-only valid style props to a webOnly const and filter it out on native? how does that work currently...
  - see various `@deprecated` jsdocs
  - need to copy/paste all the component docs to 2.0.0.mdx
  - need to remove ThemeableStack docs from components mdx, they now are all extensiond YStack instead of ThemeableStack
  - see how much of accessibilityDirectMap we can remove for web
  - `$platform-` prefixes should go away in favor of just `$web`, `$native` etc
  - @tamagui/cli => tamagui
    - `tamagui build` document/announce
    - `tamagui lint` fix check and document/announce
  - tamagui => tamagui
    - note many are headless
  - Cleanup Select/ListItem
    - v2-3 ListItem simplification esp for performance of Select
    - fix Select hover/type/performance

potential

- group => container

is this a bug? the is_static conditional is odd, maybe backward

- if (shouldRetain || !(process.env.IS_STATIC === 'is_static')) {

---

v3

- perspective={1000} can be on either transform OR on flat, need to figure that out
- `core-nested`, `core-flat`, `core-tailwind`:

```tsx
createCore<CustomTypes>({
  propMapper(propsIn) {
    return propsOut
  },
})
```

- can we remove the need for separate Text/View?
  - seems like we could scan just the direct descendents?
    https://github.com/facebook/react-strict-dom/blob/429e2fe1cb9370c59378d9ba1f4a40676bef7555/packages/react-strict-dom/src/native/modules/createStrictDOMComponent.js#L529

- light-dark()
  - this is an official css thing so would be easy-ish to implement

- run over components and review for removing some assumptions about `size`
- disableInjectCSS should maybe just be automated better or defaulted on
- flat vs style mode, style moves all tamagui styles into `style` besides the other psuedos like hover, enter, etc
- no react-native deps across the ui kit on web
- html.div, styled('div'), styled(html.div)
- `<Theme values={{}} />` dynamic override

- reanimated animate presence is making me set `opacity: 1` type default values

- Sheet.overlay is memoized incorrectly props dont update it

- popover trigger should send an event to close tooltips automatically on open
  - closeTooltips() helper
  - tooltip prop `closeOnGlobalPress`

- looks like our upgrade to 1.114 added virtualkeyboardpolicy="manual" which broke the auto keyboard appearance on android web, working on a quick fix but wanted to flag

- nan issue: nan start or end NaN 22 bytes: 0-22 [ 'bytes: 0', '22' ]

- button media queries break due to useStyle hook
- algolia creds
- uniswap/tamagui fixes, see uniswap section
  - the platform-web type issues should be relatively easy
  - fix customization https://discord.com/channels/909986013848412191/1206456825583632384/1274853294195605525

---

- SSR safe styled context, something like:

const Context = createStyledContext({
isVertical: {
$sm: true,
$gtSm: false,
},
})

- Select is using focusScope which React.Children.only erroring in most usages
  - we should try and redo FocusScope to not cloneElement at all and instead wrap with an element + display: contents

---

- small win: `useTheme()` could take a theme name to use a diff theme than the current one

- bug in useMedia + compiler
  - https://app.graphite.dev/github/pr/Uniswap/universe/10626/fix-web-toast-alignment

- AnimatePresence refactor:
  - https://x.com/mattgperry/status/1816842995758498017?s=46&t=5wFlU_OsfjJ0sQPMFbtG0A

- className merging in variants!
  - `positionSticky: { true: { className: 'position-sticky' } }`
- opacity `/50`
- AnimateList
  - like AnimatePresence but for >1 items
  - AnimatePresence keepMounted={} prop?
  - can handle direction + let you control mount behavior

- remove scroll not working when Dialog adapted to Sheet on mobile
  - we may want Sheet to have its own removeScroll in this case

- adapt nested-ScrollView problem: when a Dialog adapts to a Sheet, the Sheet already wraps contents in Sheet.ScrollView, so any inner ScrollView the consumer renders (e.g. DialogBody's `scrollable`) double-nests and content overscrolls while the sheet drags. right now dialog.tsx hand-detects `$xs` and skips its own ScrollView - that's a leaky workaround. need something better: either Adapt automatically unwraps/flattens a redundant ScrollView when adapting, or a documented pattern (e.g. a context flag the adapted child reads to know "a Sheet.ScrollView already owns scrolling, don't add one")

- AnimatePresence should just work if you change the enterStyle exitStyle dynamically in the render, no need for custom we can capture the props

- popover transform origin
  - https://codesandbox.io/p/sandbox/floating-ui-react-scale-transform-origin-qv0t1c?file=%2Fsrc%2FApp.tsx%3A43%2C25
- Setting default props for any style in a parent (variables dynamic / themes dynamic down the tree)

- Popover click outside prop

- data-disable-theme is being passed down on web snapshots
- activeTheme props for all components
- in dev mode if no checkbox indicator, warn
  - checkbox should have a default indicator probably with a simple svg check we inline
- move from useMedia match.addListener to addEventListener
- media query height taking into account the "safe height" is important
- https://linear.app/uniswap/issue/EXT-925/tamagui-error-breaking-the-extension
- document Popover.Anchor (implemented, needs docs)
- Sometimes press getting stuck still on uniswap moonpay flow
- Text vertical align issue: https://github.com/Uniswap/universe/pull/6730

- Popper arrow logic is bad, needs unstyled support and not to do weird shifting of sizes

- Adapt needs public API to support any adaptation

- Select Virtualization

- settings page in takeout SSR hydration issue due to useThemeSetting

- animatedStyle showing up in animated component snapshot on native
  - add some native snapshots in ci tests

- addTheme updateTheme regression needs a test

- type to search on Select regressed

- // TODO: pulling past the limit breaks scroll on native, need to better make ScrollView

- native theme change warning logs + theme change speed

- document popover hoverable + onOpenChange second arg via

- Select `ListItemFrame` area is messy/slow due to inline styles and complex components
- propMode

- Scale / ScaleSelect
  should be a Menu with mini visualizations of the lum/sat scales for each

- gradient style
- "var" mode where it changes types of $ to var(--)
- calc?

- get takeout users studio access

- studio color scales first class:
  - adding a color/scale really adds a theme
  - but also adds $colorName1 => $colorNameX to base theme

- check usePropsAndStyle with group props

- alt themes don't change color1-9 so you can't do color2 and then make the alt theme make it more subtle, but they should

- disableClassName breaking css animation
- css animateOnly should always force style tag styles

---

`style`

- enables Input taking { autofillSelectedStyle: Style }, or any component accepting a style object as a prop

```tsx
import { Stack, style } from '@tamagui/core'

// make it so style props accepts either a regular style object
// or something like this (can be exported from core):

type StackStyle = {
  base: ViewStyle
  press?: ViewStyle
  hover?: ViewStyle
  focus?: ViewStyle
}

const mySubStyle: StackStyle = style({
  backgroundColor: 'red', // optimizes on web to _bg-red

  pressStyle: {
    backgroundColor: 'blue', // optimizes on web to _press-bg-blue
  },
})

const MyComponent = (props: { accentedStyle?: StackStyle }) => {
  return <Stack style={[accentedStyle]} />
}
```

---

# Backlog

- imperative methods for things - sheet, popover, etc, close etc

- Popover.Close inside Sheet

- merge font-size and get-font-sized packages

- add test that builds site for prod + checks for header text / no errors

- Switch unstyled - make it so it doesn't do any theme stuff

- font weights in css are generating extra variables with "undefined" value if not filled in
- add defaultSize and defaultFontFamily to createTamagui

- @tamagui/tailwind
- pass Size down context (see Group) but really this is just Themes but for individual props (css variable direct support <Theme set={{ size: '$4' }}> ?)
- `tag` => `as` (keep fallback around as deprecated)
  - `as={['a', { ...props }]}`
- VSCode => "turn JSX into styled()"
- Switch gesture
- beforeStyle, afterStyle could work ...
  - only if we can do with pseudos:
    - focusStyle={{ after: { fullscreen: true, border... } }}
    - allows for proper focused borders that don't require super hacks
    - see Switch
  - radio may be List.Radio just combines List, Label, Drawer
    - can use Switch or check or custom
