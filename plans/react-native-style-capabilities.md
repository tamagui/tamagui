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
- Safe-area insets as built-in variables (`safe-area-top` …): web is
  `env(safe-area-inset-*)`, native rides the existing `@tamagui/native`
  safe-area state over `react-native-safe-area-context`. See the main plan's
  "Safe-area variables" section.
- Anything needing `calc()`, wide keywords, logical properties, or CSS
  variables on native stays a compile diagnostic per the main plan.

Needs testing before the grammar or types claim it:

- `fontVariant` stylistic sets (`ss01`–`ss20`, added 0.79, propagation fixed
  0.85): verify on both platforms with a real font carrying stylistic sets
  before exposing in completions or docs.

Type-surface check (2026-07-29): `mixBlendMode` and `isolation` types come
from RN's own `ViewStyle` in `code/core/web/src/types.tsx`, so new enum
values like `plus-lighter` arrive with the app's RN version; no Tamagui type
change is needed. `filter` is a Tamagui-owned string type and already covers
the syntax.

## Transforms

### 0.71: CSS-string input

- RN 0.71 added `transform: 'scaleX(2) translateX(20px)'`. The
  [web-styles umbrella](https://github.com/react/react-native/issues/34425)
  records it as available in 0.71, and the implementation landed in
  [PR 34660](https://github.com/react/react-native/pull/34660).
- This works on Paper and Fabric. In the normal path,
  `ReactNativeStyleAttributes` runs the same JS
  [`processTransform`](https://github.com/react/react-native/blob/v0.86.0/packages/react-native/Libraries/StyleSheet/processTransform.js)
  preprocessor for either renderer, turning the string into the existing
  transform array before it reaches native.
- The stable parser through 0.86 is a small RN-specific parser, not the CSS
  transform grammar. It recognizes `matrix`, `perspective`, `rotate`,
  `rotateX/Y/Z`, `scale`, `scaleX/Y`, `translate`, `translate3d`,
  `translateX/Y`, and `skewX/Y`. It does not recognize `matrix3d`,
  `rotate3d`, `scale3d`, `scaleZ`, `translateZ`, or two-axis `skew`.
  Standard six-number CSS `matrix()` is also rejected because this parser
  requires 9 or 16 numbers. `translate3d` is accepted by the JS parser but
  is not portable to Fabric's processed-transform reader in 0.86, which
  accepts two entries for its internal `translate` operation.
- Nonzero string translations require a unit. `px` is converted to RN
  density-independent points; the parser actually accepts and discards any
  alphabetic unit, so accepting `em`, `rem`, or physical CSS units would
  silently give the wrong result. Scale is unitless. Rotate and skew require
  `deg` or `rad`; CSS `turn` is unsupported.

### 0.73 and 0.75: origin and percentage translation

- `transformOrigin` is present from 0.73. Its default is the view center.
  RN first composes the transform list, then applies the origin around that
  complete matrix as `T(origin - center) * M * T(center - origin)`.
  Changing the origin does not reorder transform entries.
- RN 0.75 added percentage values for transform-array `translateX` and
  `translateY`, resolving X against the view's own width and Y against its
  own height. It was
  [New Architecture only](https://reactnative.dev/blog/2024/08/12/release-0.75#percentage-values-in-translation);
  Paper never gained the capability. This distinction disappears for the
  v3 RN >= 0.82 target because RN itself is New Architecture only.
- String and array percentages are not equivalent in stable RN 0.86.
  `transform: [{translateX: '10%'}]` works, and the string parser preserves
  percentages inside `translate(10%, 20%)`. However,
  `translateX(10%)` and `translateY(10%)` are parsed as the point value
  `10`, losing `%`. The existing RN test checks only that the string does
  not throw, not the parsed result.

### Ordering and current type surface

- Array entries are matrix-multiplied in authored order, exactly as string
  functions are emitted by the parser. Their geometric effect on a point is
  right-to-left. For example, `[{scale: 2}, {translateX: 30}]` produces a
  60-point translation because the translation affects the point before
  the scale. Reordering the entries changes the result.
- Through RN 0.86, the
  [`TransformsStyle`](https://github.com/react/react-native/blob/v0.86.0/packages/react-native/Libraries/StyleSheet/StyleSheetTypes.d.ts)
  surface has one `transform` property plus `transformOrigin`. There are no
  CSS individual `translate`, `rotate`, or `scale` style properties.
  Deprecated top-level `scaleX`, `scaleY`, `translateX`, `translateY`, and
  `rotation` fields are old RN compatibility fields, not the CSS individual
  properties. A current source, issue, and pull-request search found no open
  RFC or implementation for adding the CSS individual properties.

### Animated and Reanimated

- Core `Animated`, including `useNativeDriver: true`, animates transforms as
  an array. Its
  [`AnimatedTransform`](https://github.com/react/react-native/blob/v0.86.0/packages/react-native/Libraries/Animated/nodes/AnimatedTransform.js)
  explicitly scans an array for animated nodes; a whole transform string is
  only a static style value. An `Animated.Value` cannot be embedded inside a
  string, and interpolating the entire string does not create a native
  transform node.
- Reanimated 4.2.3 has a narrower exception: a worklet may return a
  freshly-computed CSS transform string on each frame, and its
  [`processTransform`](https://github.com/software-mansion/react-native-reanimated/blob/4.2.3/packages/react-native-reanimated/src/common/style/processors/transform.ts)
  processor converts that string to an array before the native update.
  Reanimated does not interpolate a compound transform string as a native
  transform value, and its native CSS keyframe types explicitly disallow
  string transforms. Its documented and composable animation form remains
  the transform array.

### Consequences for the v3 grammar

Claim:

- Keep `x`, `y`, `rotate`, and `scale` as independent flat-value programs.
  On web, lower them to the CSS individual properties `translate`, `rotate`,
  and `scale`. This preserves independent clause replacement and lets the
  browser apply the CSS-defined family order.
- Claim percentage `x`/`y` on native for the RN >= 0.82 target, emitting
  percentage strings only in transform-array `translateX`/`translateY`
  entries.
- Keep `transformOrigin` independent. It applies to the final composed
  transform and does not participate in family ordering.

Synthesize:

- Native must evaluate each program independently and build one transform
  array in CSS individual-property order: translate (`x`, then `y`), rotate,
  scale, then the entries from the raw `transform` property. The array order
  is semantic and must never be sorted or derived from object iteration.
- Parse a raw transform string once into the supported array representation
  before composing it. Always hand Animated and Reanimated the array form;
  do not depend on per-frame string parsing.

Diagnose:

- Reject unsupported CSS functions and units instead of forwarding them to
  RN's permissive, lossy string parser. In particular, diagnose `turn`,
  relative or physical length units, `matrix3d`, `rotate3d`, `scale3d`,
  `translateZ`, `skew()`, and six-number CSS `matrix()` until Tamagui has a
  faithful native lowering.
- Reject percentage translation when targeting RN < 0.75 or Paper. Never
  emit axis percentage strings such as `translateX(10%)` as a whole RN
  transform string, because stable RN 0.86 silently changes that value to
  10 points.
- A dynamic raw transform whose operation structure changes across states
  cannot be safely merged or animated as an opaque string. Require a
  statically parseable operation list or report a transform-family
  diagnostic.
