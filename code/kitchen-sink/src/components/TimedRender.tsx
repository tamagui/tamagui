import React from 'react'
import { Text, View } from 'react-native'

export function TimedRender(props) {
  const [start] = React.useState(performance.now())
  const [end, setEnd] = React.useState(0)

  React.useLayoutEffect(() => {
    setEnd(performance.now() - start)
  }, [start])

  return (
    <View style={{ maxWidth: '100%' }}>
      {!!end && <Text>Took {end}ms</Text>}
      <View style={{ flexDirection: 'column' }}>{props.children}</View>
    </View>
  )
}
