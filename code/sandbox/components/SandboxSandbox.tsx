// debug
import { useEffect, useState } from 'react'
import { Button, Circle, Configuration, Square, XStack, YStack } from 'tamagui'
import { animations } from '../config/tamagui/animations'
import { animationsCSS } from '../config/tamagui/animationsCSS'

export function SandboxSandbox() {
  debugger

  return (
    <>
      <Motion />
      {/* <Performance /> */}
      {/* <Drivers /> */}
    </>
  )
}

const Motion = () => {
  console.warn('render')
  const [x, setX] = useState(0)
  return (
    <Configuration animationDriver={animationsMotion}>
      <Button onPress={() => setX(Math.random())}>asdasdas</Button>
      <Square
        className="motion-square"
        animation="quickest"
        // debug="verbose"
        bg="red"
        size={100}
        pressStyle={{ scale: 1 }}
        hoverStyle={{ scale: 2 }}
      />
    </Configuration>
  )
}

// there's a sort-of bug in that if you are only using CSS driver in an entire tree
// you can avoid re-rendering entirely when doing group stuff, but we don't do that for now
// YStack will re-render on hovers etc because it can't assume children don't have any dynamicity
// we could improve this by having groups provide some context / listen for children mounting that
// are dynamic, and *if not* they don't re-render on hover / set group state at all.
const Drivers = () => {
  return (
    <>
      <Configuration animationDriver={animations}>
        <YStack group="card">
          <XStack
            animation="bouncy"
            width={100}
            height={100}
            bg="red"
            scale={1}
            $group-card-hover={{ scale: 1.5 }}
            debug="verbose"
          />
        </YStack>
      </Configuration>
      {/* because css here and below, this group YStack can avoid re-rendering */}
      <Configuration animationDriver={animationsCSS}>
        <YStack group="card">
          <XStack
            animation="bouncy"
            width={100}
            height={100}
            bg="red"
            $group-card-hover={{ scale: 1.5 }}
          />
        </YStack>
      </Configuration>
    </>
  )
}

const Performance = () => {
  const [k, setK] = useState(0)
  const [m, setM] = useState(false)

  useEffect(() => {
    setM(true)
  }, [])

  return (
    <>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div style={{ color: 'red' }} onClick={() => setK(Math.random())}>
        render
      </div>

      <Circle
        size={36}
        borderWidth={2}
        bg="yellow"
        borderColor="red"
        hoverStyle={{
          borderColor: 'green',
        }}
      />

      {m && (
        <TimedRender key={k}>
          <Circle
            size={36}
            disableOptimization
            borderWidth={2}
            bg="yellow"
            borderColor="red"
            hoverStyle={{
              borderColor: 'green',
            }}
          />
        </TimedRender>
      )}
    </>
  )
}

import React from 'react'
import { Text, View } from 'react-native'
import { animationsMotion } from '../config/tamagui/animationMotion'
// import { animationsCSS } from '../config/tamagui/animationsCSS'

export function TimedRender(props) {
  const [start] = React.useState(performance.now())
  const [end, setEnd] = React.useState(0)

  React.useLayoutEffect(() => {
    setEnd(performance.now() - start)
  }, [start])

  return (
    <View style={{ maxWidth: '100%' }}>
      {!!end && <Text style={{ color: 'yellow' }}>Took {end}ms</Text>}
      <View style={{ flexDirection: 'column' }}>{props.children}</View>
    </View>
  )
}
