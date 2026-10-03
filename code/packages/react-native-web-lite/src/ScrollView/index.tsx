// lite keeps its own dependency-free copy of the web ScrollView (see
// WebScrollView.tsx header for why it cannot re-export from
// @tamagui/scroll-view). the tamagui component's implementation lives in
// code/ui/scroll-view/src/WebScrollView.tsx — keep the two in sync.
export { WebScrollView as ScrollView } from './WebScrollView'
export type { ScrollViewMethods, ScrollViewRef } from './WebScrollView'
