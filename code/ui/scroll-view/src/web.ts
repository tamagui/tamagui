// cycle-free entry for react-native-web-lite: always the web implementation,
// never the .native file (which imports 'react-native' — in bundling contexts
// where react-native aliases to lite, importing the package root from lite
// would resolve the react-native condition and create a require cycle that
// leaves ScrollView undefined)
export { ScrollView } from './ScrollView'
export type { ScrollViewProps } from './ScrollView'
export type { ScrollViewMethods, ScrollViewRef } from './WebScrollView'
