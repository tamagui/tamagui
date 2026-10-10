# Tailwind native coverage

Measures how much of Tailwind's own class registry each library turns into
styles React Native renders on iOS: Tamagui, NativeWind and Uniwind.

```sh
npm install
npm run all   # rivals, then the tamagui dump, then score and values
```

## Method

- **Registry.** Every class `getClassList()` returns for Tailwind 4.3.3, 23,286
  classes. Nothing is hand-picked.
- **Rivals.** `rivals.cjs` compiles the registry with each library's own
  compiler, pinned in `package.json`:
  - NativeWind 5.0.0-rc.0 runs Tailwind's CSS through react-native-css 3.1.0-rc.0.
  - Uniwind 1.12.2 runs it through its native CSS processor for iOS, and the output
    is evaluated the way its runtime does.
- **Tamagui.** `tamagui.native.test.tsx` renders each class through
  `getSplitStyles` on a view, a text and an input under the v6 default config, and
  subtracts each component's own defaults. The v6 config's tokens line up with
  Tailwind's theme; an app with its own config gets its own values.
- **Scoring.** `score.cjs` counts a class as covered when all of these hold:
  - It emits something.
  - Every key it emits is a React Native 0.87 style attribute
    (`rn-style-keys.txt`, from `ReactNativeStyleAttributes`), a prop React Native
    or react-native-svg reads (`fill`, `stroke`, `numberOfLines`,
    `placeholderTextColor`, transitions), or a key that library's own runtime
    consumes.
  - Every enum value sits inside React Native's `StyleSheetTypes` union, so
    `display: 'table'` or `position: 'fixed'` does not count.
  - Every CSS property in the class that has a React Native equivalent is
    represented. `text-lg` must set both its size and its line height.
- **Modifiers.** Parts that set only custom properties (`from-red-500`,
  `shadow-red-500`) count when the library consumes them.
- **Android only.** Effects iOS cannot render (most filter functions,
  `drop-shadow`, z-axis transforms, `caret-color`) are excluded for every library.
- **Values.** `values.cjs` checks Tamagui's numeric output against the values in
  Tailwind's CSS: spacing, sizes, radii, border and outline widths, and font
  sizes and line heights.

On web all three render the full registry through Tailwind's own CSS. Tamagui
claims the classes it maps and hands the rest to the official engine.

## Result

| Library    | Covered on native | Share of registry |
| ---------- | ----------------: | ----------------: |
| Tamagui    |            12,674 |            54.43% |
| NativeWind |            12,231 |            52.53% |
| Uniwind    |            11,833 |            50.82% |

`values.cjs`: 4,006 Tamagui values checked against Tailwind, 0 mismatches.

NativeWind and Uniwind emit something for 20,497 and 22,352 classes. Much of
that output never reaches a rendered style:
- NativeWind returns only custom properties for 10,059 classes.
- Uniwind emits `maskImage` for about 6,300 mask classes and `scrollbarColor`
  for 582. React Native reads neither.

Counting emitted output instead of rendered output is how earlier comparisons
reached 88% and 96%.
