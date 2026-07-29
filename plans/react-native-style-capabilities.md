# React Native style capabilities: 0.78 → 0.86 (latest) → 0.87 (next)

Researched 2026-07-29 for the v3 flat-value grammar (`plans/dom-tailwind-flat-values.md`).
Latest stable: 0.86.2 (0.86.0 released June 11, 2026). Next: 0.87.0-rc.3.
Note the repo moved from `facebook/react-native` to `react/react-native` in the
0.86 cycle (React Foundation transition).

## Per-version style additions

### Baseline (0.76–0.77)

- 0.76: `boxShadow`, `filter` (New Architecture only at the time).
- 0.77: `mixBlendMode` stabilized, outline props
  (`outlineWidth/Color/Style/Offset`), `display: contents`; `boxSizing`
  plumbing to Yoga began.

### 0.78 (Feb 2025)

No new style props. Fixes: background clipped incorrectly with
`border-radius`; dashed/dotted borders with `overflow: hidden`.

### 0.79 (Apr 2025)

- Linear gradient: color-transition-hint syntax, `px` units in stop positions.
- `fontVariant`: stylistic sets (`ss01`–`ss20`).
- Breaking (spec compliance): unitless lengths rejected in `boxShadow` and
  `filter` (`'1 1 black'` → `'1px 1px black'`); `hwb()` comma syntax dropped.

### 0.80 (Jun 2025)

- `radial-gradient` support (JS parsing + Android draw path; iOS covered by
  the existing gradient renderer).
- Color parsing: `rgb(r g b / a)` slash-alpha, `hwb(H W B / A)`.
- `outline-offset` factored into the outline's effective border radius.
- iOS box shadows made faster. Legacy Architecture frozen.

### 0.81 (Aug 2025)

- Gradient rendering perf; transparent-color stop interpolation fixed.
- Yoga `display: contents` ownership fix.
- `<SafeAreaView>` deprecated (use `react-native-safe-area-context`).

### 0.82 (Oct 2025)

- **New Architecture only from here on.** Every earlier "New Architecture
  only" caveat (boxShadow, filter, outline, mixBlendMode, isolation) stops
  being a real fork for RN ≥ 0.82. Capability detection can drop new-arch
  branching entirely.
- `Animated` can drive `filter` on the native driver.

### 0.83 (Dec 2025)

- `backgroundImage`: real native parser lands (iOS + Android, test coverage),
  still `experimental_`-prefixed.
- `experimental_backgroundSize` / `experimental_backgroundPosition` /
  `experimental_backgroundRepeat` introduced.
- `filter`: `contrast`, `hue-rotate`, `grayscale`, `drop-shadow`, `saturate`,
  `blur` added — **Android only**.
- Fix: `boxShadow` + `overflow: hidden` interfering with `pointerEvents` and
  scale transforms.

### 0.84 (Feb 2026)

- Native `AnimationBackend` gains near-full style-prop coverage
  (`transformOrigin`, `backfaceVisibility`, `pointerEvents`, `isolation`,
  `cursor`, `boxShadow`, `mixBlendMode`, `overflow`, `position`, `zIndex`,
  `filter`, outline props, transforms, border radius, `backgroundColor`, …)
  for `useNativeDriver: true`.
- Fix: `BoxShadowValue` had `color` and `blurRadius` swapped.
- Hermes V1 default.

### 0.85 (Apr 2026)

- Shared Animation Backend (with Software Mansion) powering `Animated` and
  Reanimated; layout props (e.g. `width`) now animate on the native driver.
- Fixes: `fontVariant` stylistic values propagation; `transformOrigin` stale
  layout on recycled views. `StyleSheet.absoluteFillObject` removed.

### 0.86 (Jun 2026, current)

- `mixBlendMode: 'plus-lighter'` added.
- `Modal` forwards `style` to its inner container correctly.
- Yoga fixes for `display: contents` in absolutely-positioned subtrees;
  fractional-width text wrapping fix.
- Views with non-invertible transforms (`scaleX: 0`) no longer receive
  touches — relevant if zero-scale is used to hide interactive elements.
- Android 15+ edge-to-edge correctness for `measureInWindow`, keyboard
  avoidance, and `Dimensions`.

### 0.87 (next, rc.3)

- **`backgroundImage` loses the `experimental_` prefix** (stabilized).
  `backgroundSize/Position/Repeat` stay experimental.
- Gradient color-stop position fix (positioned stop followed by unpositioned).
- `textDecorationStyle: 'dotted' | 'dashed'` get browser-matching geometry on
  iOS (`'wavy'` still unsupported).
- Yoga: CSS Flexbox §4.5 automatic minimum sizing (opt-in errata bit) —
  layout results can change for flex children relying on the non-spec default.
- Logical border-radius mapping fix (`borderEndStartRadius` /
  `borderStartEndRadius`); `skewX`/`skewY` fixed on Android Q+.
- Props 2.0 `setProp` now propagates `transformOrigin`, `writingDirection`,
  `borderCurves` (previously silently dropped).
- `ImageBackground` deprecated (use `View` + absolute `Image`).

## Still missing from React Native entirely

- CSS logical properties (`marginInlineStart` …): RN has `Start`/`End` props
  only.
- CSS wide keywords (`inherit`, `initial`, `unset`).
- `calc()` / `clamp()` / `min()` / `max()` (RFC exists, nothing shipped) and
  CSS custom-property variables (issue open since 2023).
- CSS-string `textShadow` shorthand: still only
  `textShadowColor/Offset/Radius`.
- `cursor`: iOS 17+ only, `'auto' | 'pointer'` only.

## Consequences for the v3 grammar

Claim first-class, cross-platform:

- `boxShadow` (string and object-array forms, `inset`, multiple shadows).
- `backgroundImage` with `linear-gradient()` / `radial-gradient()`: gate on
  RN ≥ 0.83 for the real parser, ≥ 0.87 for the stable name; keep
  `backgroundSize/Position/Repeat` contributions web-only until RN
  de-experimentalizes them.
- outline props, `display: 'contents'`, `mixBlendMode`, `isolation`,
  `transformOrigin`, `position: 'static'`, `aspectRatio` strings.
- Targeting RN ≥ 0.82 removes all New Architecture capability branching.

Claim with per-platform capability diagnostics (no silent approximation):

- `filter`: iOS supports only `brightness`/`opacity`; the fuller set
  (`blur`, `grayscale`, `saturate`, `drop-shadow`, …) is Android 12+ only.
- `cursor` and `textDecorationStyle: 'wavy'` limits as above.

Synthesize in the grammar (RN will not):

- `textShadow` as a CSS string: the family expansion lowers it to the three
  legacy props on native.
- Anything needing `calc()`, wide keywords, logical properties, or CSS
  variables on native stays a compile diagnostic per the main plan.
