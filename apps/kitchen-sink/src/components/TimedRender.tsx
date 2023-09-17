import { Text } from '@tamagui/core'
import { Stack } from '@tamagui/web'
import { useLayoutEffect, useState } from 'react'
import { View } from 'react-native'

export function TimedRender(props) {
  const [start] = useState(Date.now())
  const [end, setEnd] = useState(0)

  useLayoutEffect(() => {
    setEnd(Date.now())
  }, [])

  return (
    <View style={{ maxWidth: '100%', overflow: 'hidden' }}>
      {!!end && <Text>Took {start - end}ms</Text>}
      <View style={{ flexDirection: 'row', overflow: 'hidden' }}>{props.children}</View>
    </View>
  )
}
