## Experiment!

I wanted to slim down react-native-web a bit. This does the following.

Use at your own risk.

- Flow => Typescript
- Full ESModule support
- sideEffects: false for tree shaking
- ❌ Remove VirtualList, FlatList, SectionList
- ❌ normalize-css-color
- ❌ inline-style-prefixer
- ❌ create-react-class

`@tamagui/next-plugin` and `@tamagui/vite-plugin` have an option `useReactNativeWebLite` to help automatically setting this up.
