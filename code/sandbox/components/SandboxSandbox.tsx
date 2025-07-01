// debug
import React, { forwardRef, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import {
  AnimatePresence,
  Button,
  Circle,
  Configuration,
  Square,
  XStack,
  YStack,
} from 'tamagui'

import { PopoverDemo } from '../../demos/src/PopoverDemo'
import { DialogDemo } from '../../demos/src/DialogDemo'
import { animationsMotion } from '../config/tamagui/animationMotion'
import { animations } from '../config/tamagui/animations'
import { animationsCSS } from '../config/tamagui/animationsCSS'

export function SandboxSandbox() {
  return (
    <>
      <Motion />
      {/* <DialogDemo /> */}
      {/* <PopoverDemo /> */}
      {/* <Performance /> */}
      {/* <Drivers /> */}
    </>
  )
}

const Motion = () => {
  console.warn('render')
  const [x, setX] = useState(0)
  const [show, setShow] = useState(false)
  const [pressed, setPressed] = useState(false)
  const pressedStyle = {
    y: 20,
    scale: 1.1,
  }
  return (
    <Configuration animationDriver={animationsMotion}>
      {/* animateOnly */}
      <Square
        animation={[
          'superBouncy',
          {
            opacity: '100ms',
          },
        ]}
        // bg doesnt aniamte
        animateOnly={['transform', 'opacity']}
        bg="red"
        size={50}
        opacity={0.25}
        borderWidth={2}
        hoverStyle={{ scale: 1.5, borderColor: 'green', opacity: 1 }}
        pressStyle={{ scale: 0.8, borderColor: 'red' }}
        x={x * 300}
      />

      <Button onPress={() => setX(Math.random())}>asdasdas</Button>

      <Square
        animation={[
          'superBouncy',
          {
            opacity: '100ms',
          },
        ]}
        bg="red"
        size={50}
        opacity={0.25}
        borderWidth={2}
        hoverStyle={{ scale: 1.5, borderColor: 'green', opacity: 1 }}
        pressStyle={{ scale: 0.8, borderColor: 'red' }}
        x={x * 300}
      />

      <Button onPress={() => setShow(!show)}>show</Button>

      <YStack width="100%" bg="yellow" group="card">
        {/* render during animate update */}
        <Square
          animation="lazy"
          onMouseDown={() => {
            setPressed(true)
          }}
          onMouseUp={() => {
            setPressed(false)
          }}
          $group-card-hover={{
            y: 10,
            scale: 1.1,
          }}
          $group-card-press={pressedStyle}
          {...(pressed && pressedStyle)}
          size={50}
          bg="red"
        />

        <AnimatePresence>
          {show && (
            <Square
              animation="lazy"
              $group-card-hover={{
                scale: 2,
              }}
              size={50}
              bg="rgba(255,200,200)"
              hoverStyle={{
                bg: 'rgba(200,200,200)',
                scale: 1.1,
              }}
              enterStyle={{
                y: -100,
                opacity: 0,
              }}
              exitStyle={{
                y: 100,
                opacity: 0,
              }}
            />
          )}
        </AnimatePresence>
      </YStack>
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
