# Deprecated: ⚠️

Just use react-native-web, it's evolved enough to fix a few things and this has been left behind a bit.

## Experiment!

Use at your own risk.

Slimming down react-native-web, this does the following:

- Flow => Typescript
- Full ESModule support
- Vite compatibility
- `sideEffects: false` + tree shaking support changes
- merges [concurrent mode fixes](https://github.com/necolas/react-native-web/pull/2330)
- merges the [experimental fully concurrent safe / functional `Animated`](https://github.com/facebook/react-native/blob/main/Libraries/Animated/createAnimatedComponent_EXPERIMENTAL.js)
- Removes:
  - ❌ VirtualList, FlatList, SectionList
  - ❌ Switch (going to be split out, in Tamagui already)
  - ❌ Touchable* views (prefer Pressable)
  - ❌ normalize-css-color
  - ❌ inline-style-prefixer
  - ❌ create-react-class

`@tamagui/next-plugin` and `@tamagui/vite-plugin` have an option `useReactNativeWebLite` to help automatically setting this up.

With webpack:

Alias the following

- react-native-web$ => react-native-web-lite
- react-native-svg => @tamagui/react-native-svg
