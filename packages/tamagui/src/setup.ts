import { setupReactNative } from '@tamagui/core'
import { Image, ScrollView, Text, TextInput, View } from 'react-native'

setupReactNative({
  Image,
  View,
  Text,
  TextInput,
  ScrollView,
})

// for SSR
if (typeof requestAnimationFrame === 'undefined') {
  globalThis['requestAnimationFrame'] = setImmediate
}

// for vite / Animated.spring()
global.cancelAnimationFrame = (x) => {
  try {
    cancelAnimationFrame(x)
  } catch {
    // illegal invocation :/
  }
}

// need to export something, afraid of tree shaking even with `sideEffects`
export const idFn = () => {}
