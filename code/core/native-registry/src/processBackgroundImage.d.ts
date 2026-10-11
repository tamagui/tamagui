// react-native ships this processor untyped; it returns the parsed gradient list
declare module 'react-native/Libraries/StyleSheet/processBackgroundImage' {
  export default function processBackgroundImage(
    backgroundImage: unknown
  ): ReadonlyArray<Record<string, unknown>>
}
