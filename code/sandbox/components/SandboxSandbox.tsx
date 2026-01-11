// debug
import React, { forwardRef, useEffect, useState } from 'react'
import { View } from 'react-native'
import {
  AnimatePresence,
  Button,
  Circle,
  Configuration,
  Square,
  Text,
  Theme,
  XStack,
  YStack,
  useThemeName,
} from 'tamagui'

import { PopoverDemo } from '../../demos/src/PopoverDemo'
import { DialogDemo } from '../../demos/src/DialogDemo'
import { TestPopoverTransformOrigin } from '../use-cases/TestPopoverTransformOrigin'
import { animationsMotion } from '../config/tamagui/animationMotion'
import { animations as animationsMoti } from '../config/tamagui/animations'
import { animationsCSS } from '../config/tamagui/animationsCSS'
import { animationsNative } from '../config/tamagui/animationNative'

const delayColors = ['red', 'green', 'blue', 'purple'] as const

/**
 * Reusable delay demo component that works with any animation driver
 * Tests: animation={['medium', { delay: i * 100 }]}
 */
function DelayDemoContent({
  show,
  onToggle,
  driverName,
}: {
  show: boolean
  onToggle: () => void
  driverName: string
}) {
  return (
    <YStack
      gap="$3"
      p="$4"
      bg="$background"
      borderWidth={1}
      borderColor="$borderColor"
      width={260}
    >
      <Text fontWeight="bold" fontSize="$5">
        {driverName}
      </Text>

      <Button onPress={onToggle} size="$3">
        {show ? 'Hide' : 'Show'}
      </Button>

      <XStack gap="$2" height={50}>
        <AnimatePresence>
          {show &&
            delayColors.map((color, i) => (
              <Square
                key={color}
                animation={['medium', { delay: i * 100 }]}
                size={40}
                bg={color}
                enterStyle={{ opacity: 0, scale: 0.5, y: 10 }}
                exitStyle={{ opacity: 0, scale: 0.5, y: -10 }}
              />
            ))}
        </AnimatePresence>
      </XStack>

      <Text fontSize="$1" opacity={0.5}>
        delays: 0ms, 100ms, 200ms, 300ms
      </Text>
    </YStack>
  )
}

/**
 * Demo showing animation delay support across all 4 animation drivers
 * Pattern: animation={['medium', { delay: i * 100 }]}
 */
function AnimationDelayDemo() {
  const [showCSS, setShowCSS] = useState(false)
  const [showMoti, setShowMoti] = useState(false)
  const [showMotion, setShowMotion] = useState(false)
  const [showNative, setShowNative] = useState(false)

  return (
    <YStack gap="$4" p="$4">
      <Text fontWeight="bold" fontSize="$6">
        Animation Delay Test
      </Text>
      <Text fontSize="$2" opacity={0.7}>
        {`animation={['medium', { delay: i * 100 }]}`}
      </Text>

      <XStack flexWrap="wrap" gap="$4">
        <Configuration animationDriver={animationsCSS}>
          <DelayDemoContent
            show={showCSS}
            onToggle={() => setShowCSS(!showCSS)}
            driverName="CSS"
          />
        </Configuration>

        <Configuration animationDriver={animationsMoti}>
          <DelayDemoContent
            show={showMoti}
            onToggle={() => setShowMoti(!showMoti)}
            driverName="Moti"
          />
        </Configuration>

        <Configuration animationDriver={animationsMotion}>
          <DelayDemoContent
            show={showMotion}
            onToggle={() => setShowMotion(!showMotion)}
            driverName="Motion"
          />
        </Configuration>

        <Configuration animationDriver={animationsNative}>
          <DelayDemoContent
            show={showNative}
            onToggle={() => setShowNative(!showNative)}
            driverName="RN Animated"
          />
        </Configuration>
      </XStack>
    </YStack>
  )
}

const ThemeDebug = () => {
  const themeName = useThemeName()
  return <Text>Theme: {themeName}</Text>
}

export function SandboxSandbox() {
  return (
    <>
      {/* Test transformOrigin for Popover */}
      <TestPopoverTransformOrigin />
      {/* <AnimationDelayDemo /> */}
      {/* <ThemeAccent /> */}
      {/* <Motion /> */}
      {/* <DialogDemo /> */}
      {/* <PopoverDemo /> */}
      {/* <Performance /> */}
      {/* <Drivers /> */}
    </>
  )
}

const ThemeAccent = () => {
  return (
    <YStack gap="$4" p="$4">
      {/* ================================ */}
      {/* Test 1: Base accent - should swap light to dark */}
      {/* ================================ */}
      <YStack gap="$2" bg="$color3" p="$4">
        <Text fontWeight="bold" fontSize="$6">
          Test 1: Base Accent
        </Text>
      </YStack>
      <XStack gap="$4">
        <YStack
          gap="$2"
          bg="$background"
          p="$4"
          borderWidth={2}
          borderColor="$borderColor"
          flex={1}
        >
          <ThemeDebug />
          <Text fontWeight="bold">Normal (Light)</Text>
          <Text fontSize="$2" color="$color10">
            ✓ Expected: Light background
          </Text>
          <Text fontSize="$2" color="$color10">
            ✓ Expected: Dark text
          </Text>
          <Button>Light Button</Button>
        </YStack>

        <Theme name="dark">
          <YStack
            gap="$2"
            bg="red"
            p="$4"
            borderWidth={2}
            borderColor="$borderColor"
            flex={1}
          >
            <ThemeDebug />
            <Text fontWeight="bold">Accent (Dark)</Text>
            <Text fontSize="$2" color="$color10">
              ✓ Expected: Dark background
            </Text>
            <Text fontSize="$2" color="$color10">
              ✓ Expected: Light text
            </Text>
            <Theme name="accent">
              <YStack gap="$2">
                <ThemeDebug />
                <Button bg="$background02">Light Button</Button>
              </YStack>
            </Theme>
          </YStack>
        </Theme>
      </XStack>

      {/* ================================ */}
      {/* Test 2: Explicit light + accent */}
      {/* ================================ */}
      <YStack gap="$2" bg="$color3" p="$4" mt="$4">
        <Text fontWeight="bold" fontSize="$6">
          Test 2: Light + Accent
        </Text>
      </YStack>
      <XStack gap="$4">
        <Theme name="light">
          <YStack
            gap="$2"
            bg="$background02"
            p="$4"
            borderWidth={2}
            borderColor="$borderColor"
            flex={1}
          >
            <ThemeDebug />
            <Text fontWeight="bold">Light Theme</Text>
            <Text fontSize="$2" color="$color10">
              ✓ Expected: Light gray background
            </Text>
            <Button>Light Button</Button>
          </YStack>
        </Theme>

        <Theme name="light">
          <YStack
            gap="$2"
            bg="$background"
            p="$4"
            borderWidth={2}
            borderColor="$borderColor"
            flex={1}
          >
            <ThemeDebug />
            <Text fontWeight="bold">Light + Accent</Text>
            <Text fontSize="$2" color="$color10">
              ✓ Expected: Dark gray background
            </Text>
            <Text fontSize="$2" color="$color10">
              ✓ Expected: Palette swapped to dark
            </Text>
            <Theme name="accent">
              <Button>Dark Button aaa</Button>
            </Theme>
          </YStack>
        </Theme>
      </XStack>

      {/* ================================ */}
      {/* Test 3: Explicit dark + accent */}
      {/* ================================ */}
      <YStack gap="$2" bg="$color3" p="$4" mt="$4">
        <Text fontWeight="bold" fontSize="$6">
          Test 3: Dark + Accent
        </Text>
      </YStack>
      <XStack gap="$4">
        <Theme name="dark">
          <YStack
            gap="$2"
            bg="$background02"
            p="$4"
            borderWidth={2}
            borderColor="$borderColor"
            flex={1}
          >
            <ThemeDebug />
            <Text fontWeight="bold">Dark Theme</Text>
            <Text fontSize="$2" color="$color10">
              ✓ Expected: Dark gray background
            </Text>
            <Button>Dark Button</Button>
          </YStack>
        </Theme>

        <Theme name="dark">
          <Theme name="accent">
            <YStack
              gap="$2"
              bg="$background02"
              p="$4"
              borderWidth={2}
              borderColor="$borderColor"
              flex={1}
            >
              <ThemeDebug />
              <Text fontWeight="bold">Dark + Accent</Text>
              <Text fontSize="$2" color="$color10">
                ✓ Expected: Light gray background
              </Text>
              <Text fontSize="$2" color="$color10">
                ✓ Expected: Palette swapped to light
              </Text>
              <Button>Light Button</Button>
            </YStack>
          </Theme>
        </Theme>
      </XStack>

      {/* ================================ */}
      {/* Test 4: RED color theme + accent */}
      {/* ================================ */}
      <YStack gap="$2" bg="$color3" p="$4" mt="$4">
        <Text fontWeight="bold" fontSize="$6">
          Test 4: Red + Accent (CRITICAL TEST)
        </Text>
      </YStack>
      <XStack gap="$4">
        <Theme name="red">
          <YStack
            gap="$2"
            bg="$background02"
            p="$4"
            borderWidth={2}
            borderColor="$borderColor"
            flex={1}
          >
            <ThemeDebug />
            <Text fontWeight="bold">Red Theme</Text>
            <Text fontSize="$2" color="$color10">
              ✓ Expected: Light red tones
            </Text>
            <Text fontSize="$2" color="$color10">
              ✓ Expected: Theme = light_red
            </Text>
            <Button>Red Button</Button>
          </YStack>
        </Theme>

        <Theme name="light">
          <Theme name="red">
            <Theme name="accent">
              <YStack
                gap="$2"
                bg="$background02"
                p="$4"
                borderWidth={2}
                borderColor="$borderColor"
                flex={1}
              >
                <ThemeDebug />
                <Text fontWeight="bold">Red + Accent</Text>
                <Text fontSize="$2" color="$color10">
                  ✓ Expected: Dark RED tones
                </Text>
                <Text fontSize="$2" color="$color10">
                  ✓ Expected: NOT black/gray!
                </Text>
                <Text fontSize="$2" color="$color10">
                  ✓ Expected: Theme = light_red_accent
                </Text>
                <Button>Dark Red Button</Button>
              </YStack>
            </Theme>
          </Theme>
        </Theme>
      </XStack>

      {/* ================================ */}
      {/* Test 5: BLUE color theme + accent */}
      {/* ================================ */}
      <YStack gap="$2" bg="$color3" p="$4" mt="$4">
        <Text fontWeight="bold" fontSize="$6">
          Test 5: Blue + Accent
        </Text>
      </YStack>
      <XStack gap="$4">
        <Theme name="blue">
          <YStack
            gap="$2"
            bg="$background02"
            p="$4"
            borderWidth={2}
            borderColor="$borderColor"
            flex={1}
          >
            <ThemeDebug />
            <Text fontWeight="bold">Blue Theme</Text>
            <Text fontSize="$2" color="$color10">
              ✓ Expected: Light blue tones
            </Text>
            <Text fontSize="$2" color="$color10">
              ✓ Expected: Theme = light_blue
            </Text>
            <Button>Blue Button</Button>
          </YStack>
        </Theme>

        <Theme name="blue">
          <Theme name="accent">
            <YStack
              gap="$2"
              bg="$background02"
              p="$4"
              borderWidth={2}
              borderColor="$borderColor"
              flex={1}
            >
              <ThemeDebug />
              <Text fontWeight="bold">Blue + Accent</Text>
              <Text fontSize="$2" color="$color10">
                ✓ Expected: Dark BLUE tones
              </Text>
              <Text fontSize="$2" color="$color10">
                ✓ Expected: NOT black/gray!
              </Text>
              <Text fontSize="$2" color="$color10">
                ✓ Expected: Theme = light_blue_accent
              </Text>
              <Button>Dark Blue Button</Button>
            </YStack>
          </Theme>
        </Theme>
      </XStack>

      {/* ================================ */}
      {/* Test 6: GREEN color theme + accent */}
      {/* ================================ */}
      <YStack gap="$2" bg="$color3" p="$4" mt="$4">
        <Text fontWeight="bold" fontSize="$6">
          Test 6: Green + Accent
        </Text>
      </YStack>
      <XStack gap="$4">
        <Theme name="green">
          <YStack
            gap="$2"
            bg="$background02"
            p="$4"
            borderWidth={2}
            borderColor="$borderColor"
            flex={1}
          >
            <ThemeDebug />
            <Text fontWeight="bold">Green Theme</Text>
            <Text fontSize="$2" color="$color10">
              ✓ Expected: Light green tones
            </Text>
            <Text fontSize="$2" color="$color10">
              ✓ Expected: Theme = light_green
            </Text>
            <Button>Green Button</Button>
          </YStack>
        </Theme>

        <Theme name="green">
          <Theme name="accent">
            <YStack
              gap="$2"
              bg="$background02"
              p="$4"
              borderWidth={2}
              borderColor="$borderColor"
              flex={1}
            >
              <ThemeDebug />
              <Text fontWeight="bold">Green + Accent</Text>
              <Text fontSize="$2" color="$color10">
                ✓ Expected: Dark GREEN tones
              </Text>
              <Text fontSize="$2" color="$color10">
                ✓ Expected: NOT black/gray!
              </Text>
              <Text fontSize="$2" color="$color10">
                ✓ Expected: Theme = light_green_accent
              </Text>
              <Button>Dark Green Button</Button>
            </YStack>
          </Theme>
        </Theme>
      </XStack>

      {/* ================================ */}
      {/* Test 7: YELLOW color theme + accent */}
      {/* ================================ */}
      <YStack gap="$2" bg="$color3" p="$4" mt="$4">
        <Text fontWeight="bold" fontSize="$6">
          Test 7: Yellow + Accent
        </Text>
      </YStack>
      <XStack gap="$4">
        <Theme name="yellow">
          <YStack
            gap="$2"
            bg="$background02"
            p="$4"
            borderWidth={2}
            borderColor="$borderColor"
            flex={1}
          >
            <ThemeDebug />
            <Text fontWeight="bold">Yellow Theme</Text>
            <Text fontSize="$2" color="$color10">
              ✓ Expected: Light yellow tones
            </Text>
            <Text fontSize="$2" color="$color10">
              ✓ Expected: Theme = light_yellow
            </Text>
            <Button>Yellow Button</Button>
          </YStack>
        </Theme>

        <Theme name="yellow">
          <Theme name="accent">
            <YStack
              gap="$2"
              bg="$background02"
              p="$4"
              borderWidth={2}
              borderColor="$borderColor"
              flex={1}
            >
              <ThemeDebug />
              <Text fontWeight="bold">Yellow + Accent</Text>
              <Text fontSize="$2" color="$color10">
                ✓ Expected: Dark YELLOW tones
              </Text>
              <Text fontSize="$2" color="$color10">
                ✓ Expected: NOT black/gray!
              </Text>
              <Text fontSize="$2" color="$color10">
                ✓ Expected: Theme = light_yellow_accent
              </Text>
              <Button>Dark Yellow Button</Button>
            </YStack>
          </Theme>
        </Theme>
      </XStack>

      {/* ================================ */}
      {/* Test 8: NESTED accent - double accent brings back original */}
      {/* ================================ */}
      <YStack gap="$2" bg="$color3" p="$4" mt="$4">
        <Text fontWeight="bold" fontSize="$6">
          Test 8: Nested Accent (Double Accent)
        </Text>
      </YStack>
      <XStack gap="$4" flexWrap="wrap">
        <Theme name="light">
          <YStack
            gap="$2"
            bg="$background02"
            p="$4"
            borderWidth={2}
            borderColor="$borderColor"
            minW={200}
          >
            <ThemeDebug />
            <Text fontWeight="bold">Light</Text>
            <Text fontSize="$2" color="$color10">
              ✓ Expected: Light theme
            </Text>
            <Button>Light</Button>
          </YStack>
        </Theme>

        <Theme name="light">
          <Theme name="accent">
            <YStack
              gap="$2"
              bg="$background02"
              p="$4"
              borderWidth={2}
              borderColor="$borderColor"
              minW={200}
            >
              <ThemeDebug />
              <Text fontWeight="bold">Light + Accent</Text>
              <Text fontSize="$2" color="$color10">
                ✓ Expected: Dark theme
              </Text>
              <Button>Dark</Button>
            </YStack>
          </Theme>
        </Theme>

        <Theme name="light">
          <Theme name="accent">
            <Theme name="accent">
              <YStack
                gap="$2"
                bg="$background02"
                p="$4"
                borderWidth={2}
                borderColor="$borderColor"
                minW={200}
              >
                <ThemeDebug />
                <Text fontWeight="bold">Light + Accent + Accent</Text>
                <Text fontSize="$2" color="$color10">
                  ✓ Expected: Light again!
                </Text>
                <Text fontSize="$2" color="$color10">
                  ✓ Double negative = positive
                </Text>
                <Button>Doesn't work!</Button>
              </YStack>
            </Theme>
          </Theme>
        </Theme>
      </XStack>

      <XStack gap="$4" flexWrap="wrap" mt="$2">
        <Theme name="red">
          <YStack
            gap="$2"
            bg="$background02"
            p="$4"
            borderWidth={2}
            borderColor="$borderColor"
            minW={200}
          >
            <ThemeDebug />
            <Text fontWeight="bold">Red</Text>
            <Text fontSize="$2" color="$color10">
              ✓ Expected: Light red
            </Text>
            <Button>Light Red</Button>
          </YStack>
        </Theme>

        <Theme name="red">
          <YStack
            gap="$2"
            bg="$background02"
            p="$4"
            borderWidth={2}
            borderColor="$borderColor"
            minW={200}
          >
            <ThemeDebug />
            <Text fontWeight="bold">Red + Accent</Text>
            <Text fontSize="$2" color="$color10">
              ✓ Expected: Dark red
            </Text>
            <Button theme="accent">Dark Red</Button>
          </YStack>
        </Theme>

        <Theme name="red">
          <Theme name="accent">
            <Theme name="accent">
              <YStack
                gap="$2"
                bg="$background02"
                p="$4"
                borderWidth={2}
                borderColor="$borderColor"
                minW={200}
              >
                <ThemeDebug />
                <Text fontWeight="bold">Red + Accent + Accent</Text>
                <Text fontSize="$2" color="$color10">
                  ✓ Expected: Light red again!
                </Text>
                <Button>Doesn't work!</Button>
              </YStack>
            </Theme>
          </Theme>
        </Theme>
      </XStack>
    </YStack>
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

  const squares = (
    <>
      <Square
        animation="lazy"
        size={50}
        bg="green"
        $group-card-hover={{ bg: 'magenta', scale: 1.1 }}
        $group-card-press={{ rotate: '5deg' }}
        $group-hover={{ bg: 'yellow' }}
        $group-other-press={{ y: 20, bg: 'rgba(255,255,0,0.5)' }}
      />
      <Square
        animation="lazy"
        size={50}
        bg="yellow"
        $group-card-hover={{ bg: 'magenta', scale: 1.1 }}
        $group-card-press={{ rotate: '5deg' }}
        $group-other-hover={{ bg: 'black', x: 10 }}
      />
      <Square
        animation="lazy"
        size={50}
        bg="green"
        $group-card-hover={{ bg: 'magenta', scale: 1.1 }}
        $group-card-press={{ rotate: '5deg' }}
        $group-hover={{ bg: 'yellow' }}
        $group-other-press={{ y: 20, bg: 'rgba(255,255,0,0.5)' }}
      />
    </>
  )

  return (
    <Configuration animationDriver={animationsMotion}>
      {/* groups in groups */}
      <YStack width={600} height={600} group bg="teal">
        <XStack flexWrap="wrap" width={400} height={400} bg="pink" group="card">
          <YStack m={10} width={150} height={150} group="other" bg="red">
            {squares}
          </YStack>

          <YStack m={10} width={150} height={150} group="other" bg="red">
            {squares}
          </YStack>

          <YStack m={10} width={150} height={150} group="other" bg="red">
            {squares}
          </YStack>

          <YStack m={10} width={150} height={150} group="other" bg="red">
            {squares}
          </YStack>
        </XStack>
      </YStack>

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
        // TODO no media re-renders
        $maxMd={{
          bg: 'blue',
        }}
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
          // onMouseDown={() => {
          //   setPressed(true)
          // }}
          // onMouseUp={() => {
          //   setPressed(false)
          // }}
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
      <Configuration animationDriver={animationsMoti}>
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
