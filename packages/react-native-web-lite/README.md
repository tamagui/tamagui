## Experiment!

Use at your own risk.

Slimming down react-native-web, this does the following:

- Flow => Typescript
- Full ESModule support
- sideEffects: false for tree shaking
- merges [concurrent mode fixes](https://github.com/necolas/react-native-web/pull/2330)
- Removes:
  - ❌ VirtualList, FlatList, SectionList
  - ❌ deprecated Touchable* views (prefer Pressable)
  - ❌ normalize-css-color
  - ❌ inline-style-prefixer
  - ❌ create-react-class

`@tamagui/next-plugin` and `@tamagui/vite-plugin` have an option `useReactNativeWebLite` to help automatically setting this up.

With webpack:

Alias the following

- react-native-web$ => react-native-web-lite
- @tamagui/rnw => @tamagui/rnw-lite
- react-native-svg => react-native-svg-web
