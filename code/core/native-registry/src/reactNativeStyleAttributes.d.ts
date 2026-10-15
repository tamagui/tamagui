// react-native ships its style attribute table untyped. a key with a processor
// maps to `{ process }`, which turns the authored value into fabric's form; the
// rest map to `true`, whose `process` reads as undefined
declare module 'react-native/Libraries/Components/View/ReactNativeStyleAttributes' {
  const ReactNativeStyleAttributes: Record<
    string,
    { process?: (value: unknown) => unknown } | undefined
  >
  export default ReactNativeStyleAttributes
}
