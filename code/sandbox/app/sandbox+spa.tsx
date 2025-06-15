import { useLayoutEffect, useState } from 'react'
import { Circle, Text, View } from 'tamagui'

export default function Sandbox() {
  return (
    <>
      <Performance />
    </>
  )
}

const Performance = () => {
  const [k, setK] = useState(0)

  return (
    <>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div style={{ color: 'red' }} onClick={() => setK(Math.random())}>
        render
      </div>
      <TimedRender key={k}>
        <Circle
          debug="profile"
          size={36}
          borderWidth={2}
          bg="yellow"
          borderColor="red"
          hoverStyle={{
            borderColor: 'green',
          }}
          onPress={() => {
            //
          }}
        />
      </TimedRender>
    </>
  )
}

import React from 'react'

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
