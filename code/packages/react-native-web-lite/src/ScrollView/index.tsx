// the web ScrollView implementation now lives in @tamagui/scroll-view so the
// tamagui component no longer depends on react-native (via this lite alias) on
// web. lite re-exports it to keep `import { ScrollView } from 'react-native'`
// working on web.

export { ScrollView } from '@tamagui/scroll-view'
export type { ScrollViewRef, ScrollViewMethods } from '@tamagui/scroll-view'
