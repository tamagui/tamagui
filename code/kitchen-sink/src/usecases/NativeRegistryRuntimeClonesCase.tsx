import React, { useLayoutEffect, useRef, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import * as registry from '@tamagui/native-registry'

const initialStyle = { height: 100, backgroundColor: '#ff0000' }

// use a runtime link, with a scroll view below it and React commits beside it.
// the rendered style stays red while native updates change the ancestor.
export function NativeRegistryRuntimeClonesCase() {
  const host = useRef<React.ComponentRef<typeof View>>(null)
  const link = useRef<registry.LinkHandle | null>(null)
  const [revision, setRevision] = useState(0)
  const [nativeProps, setNativeProps] = useState('not read')
  const [style, setStyle] = useState(initialStyle)

  useLayoutEffect(() => {
    link.current = registry.link(host.current, {}, '')
    return () => link.current?.unlink()
  }, [])

  const apply = (state: string, backgroundColor: string | null) => {
    registry.applyViewStates([
      {
        id: link.current!.id,
        state,
        props: registry.processStyleColors({
          height: 100,
          flexDirection: 'column',
          backgroundColor,
        }),
      },
    ])
    setNativeProps(JSON.stringify(registry.getViewState(link.current!.id)?.nativeProps))
  }

  return (
    <View style={{ flex: 1, paddingTop: 70, backgroundColor: '#ffffff' }}>
      <Pressable testID="runtime-green" onPress={() => apply('green', '#00ff00')}>
        <Text>native green</Text>
      </Pressable>
      <Pressable testID="runtime-red" onPress={() => apply('red', '#ff0000')}>
        <Text>native red</Text>
      </Pressable>
      <Pressable testID="runtime-reset" onPress={() => apply('reset', null)}>
        <Text>reset color</Text>
      </Pressable>
      <Pressable testID="runtime-react" onPress={() => setRevision((n) => n + 1)}>
        <Text>React sibling {revision}</Text>
      </Pressable>
      <Pressable
        testID="runtime-style"
        onPress={() => setStyle({ height: 100, backgroundColor: '#0000ff' })}
      >
        <Text>React blue</Text>
      </Pressable>
      <Text testID="runtime-native-props">{nativeProps}</Text>
      <View ref={host} testID="runtime-ancestor" style={style} collapsable={false}>
        <ScrollView horizontal testID="runtime-scroll">
          {Array.from({ length: 80 }, (_, n) => (
            <View key={n} style={{ width: 120 }}>
              <Text>{n}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}
