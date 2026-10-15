import { setNativeStyleEngine, type NativeStyleEngine } from '@tamagui/core'
import * as registry from '@tamagui/native-registry'
import React, { Suspense, memo, useLayoutEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Square, Theme } from 'tamagui'

// react-freeze (react-native-screens freezeOnBlur) suspends a mounted subtree:
// its hosts detach and its renders defer until it is revealed (#4333)
const frozenForever = new Promise<never>(() => {})
function Suspender({ frozen }: { frozen: boolean }) {
  if (frozen) throw frozenForever
  return null
}

const Swatch = memo(function Swatch() {
  return (
    <Square
      testID="freeze-swatch"
      width={120}
      height={120}
      backgroundColor="background"
    />
  )
})

export function NativeRegistryFreezeRevealCase() {
  const [ready, setReady] = useState(false)
  const [theme, setTheme] = useState<'red' | 'green'>('red')
  const [frozen, setFrozen] = useState(false)

  useLayoutEffect(() => {
    setNativeStyleEngine(registry as unknown as NativeStyleEngine)
    setReady(true)
    return () => setNativeStyleEngine(null)
  }, [])

  if (!ready) return null

  return (
    <View style={{ flex: 1, paddingTop: 70, backgroundColor: '#ffffff' }}>
      <Pressable
        testID="freeze-theme"
        onPress={() => setTheme((name) => (name === 'red' ? 'green' : 'red'))}
      >
        <Text>theme {theme}</Text>
      </Pressable>
      <Pressable testID="freeze-toggle" onPress={() => setFrozen((value) => !value)}>
        <Text>{frozen ? 'frozen' : 'visible'}</Text>
      </Pressable>
      <Theme name={theme}>
        <Suspense fallback={null}>
          <Suspender frozen={frozen} />
          <Swatch />
        </Suspense>
      </Theme>
    </View>
  )
}
