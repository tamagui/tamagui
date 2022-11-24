import { setupReactNative } from '@tamagui/core'
import * as React from 'react'
import { Text, View } from 'react-native'

globalThis.React = React

setupReactNative({
  View,
  Text,
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
