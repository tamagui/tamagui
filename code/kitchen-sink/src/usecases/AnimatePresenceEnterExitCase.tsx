import { useState, useRef, useCallback } from 'react'
import { AnimatePresence } from '@tamagui/animate-presence'
import { Button, Circle, Paragraph, Square, Text, XStack, YStack } from 'tamagui'

/**
 * Tests that enterStyle/exitStyle actually animate (opacity changes)
 * when using AnimatePresence with conditional rendering.
 *
 * Bug: motion driver doesn't animate enter/exit styles at all,
 * while CSS driver works fine.
 */

declare global {
  interface Window {
    __enterExitFrames: Record<string, number[]>
    __enterExitReady: Record<string, boolean>
  }
}

if (typeof window !== 'undefined') {
  window.__enterExitFrames = {}
  window.__enterExitReady = {}
}

function useOpacityTracker(id: string, testId: string) {
  const rafRef = useRef<number>(0)

  const startTracking = useCallback(() => {
    if (typeof window === 'undefined') return
    window.__enterExitFrames[id] = []

    const track = () => {
      const el = document.querySelector(`[data-testid="${testId}"]`)
      if (el) {
        const opacity = parseFloat(getComputedStyle(el).opacity)
        window.__enterExitFrames[id].push(opacity)
      }
      rafRef.current = requestAnimationFrame(track)
    }
    rafRef.current = requestAnimationFrame(track)
  }, [id, testId])

  const stopTracking = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
  }, [])

  return { startTracking, stopTracking }
}

export function AnimatePresenceEnterExitCase() {
  return (
    <YStack gap="$4" padding="$4">
      <Paragraph fontWeight="bold" fontSize="$5">
        AnimatePresence Enter/Exit Animation Test
      </Paragraph>

      <Scenario01_BasicEnterExit />
      <Scenario02_CircleBadge />
      <Scenario03_InitialFalse />
    </YStack>
  )
}

/**
 * Scenario 01: basic square with enterStyle/exitStyle opacity
 */
function Scenario01_BasicEnterExit() {
  const [show, setShow] = useState(false)
  const tracker = useOpacityTracker('01', 'enter-exit-01-target')

  const handleToggle = () => {
    tracker.startTracking()
    setShow((v) => !v)
    // stop tracking after animation should be done
    setTimeout(() => {
      tracker.stopTracking()
      if (typeof window !== 'undefined') {
        window.__enterExitReady['01'] = true
      }
    }, 1000)
  }

  return (
    <YStack gap="$2">
      <Paragraph size="$2">Scenario 01: Basic enter/exit opacity</Paragraph>
      <Button testID="enter-exit-01-trigger" onPress={handleToggle}>
        Toggle
      </Button>
      <XStack height={80} items="center">
        <AnimatePresence>
          {show ? (
            <Square
              key="test-square"
              testID="enter-exit-01-target"
              transition="medium"
              size={60}
              bg="$blue10"
              enterStyle={{
                opacity: 0,
              }}
              exitStyle={{
                opacity: 0,
              }}
            />
          ) : null}
        </AnimatePresence>
      </XStack>
    </YStack>
  )
}

/**
 * Scenario 02: circle badge with initial={false}
 * Exact match for the real-world bug case in SidebarActionButtons
 */
function Scenario03_InitialFalse() {
  const [count, setCount] = useState(0)
  const countString = count > 0 ? `${count}` : ''

  const handleIncrement = () => {
    setCount((c) => c + 1)
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.__enterExitReady['03'] = true
      }
    }, 1000)
  }

  const handleClear = () => {
    setCount(0)
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.__enterExitReady['03-exit'] = true
      }
    }, 1000)
  }

  return (
    <YStack gap="$2">
      <Paragraph size="$2">Scenario 03: initial=false (exact real-world case)</Paragraph>
      <XStack gap="$2">
        <Button testID="enter-exit-03-increment" onPress={handleIncrement}>
          Add
        </Button>
        <Button testID="enter-exit-03-clear" onPress={handleClear}>
          Clear
        </Button>
      </XStack>
      <XStack height={40} items="center" position="relative">
        <AnimatePresence initial={false}>
          {countString ? (
            <Circle
              key="count-badge-03"
              testID="enter-exit-03-target"
              transition="medium"
              bg="$color12"
              size={16}
              position="absolute"
              t={4}
              r={6}
              items="center"
              justify="center"
              enterStyle={{
                opacity: 0,
                y: -3,
              }}
              exitStyle={{
                opacity: 0,
                y: -3,
              }}
            >
              <Text color="$color1" fontFamily="$mono" fontSize={10} lineHeight={10}>
                {countString}
              </Text>
            </Circle>
          ) : null}
        </AnimatePresence>
      </XStack>
    </YStack>
  )
}

/**
 * Scenario 02: circle badge (matches the real-world bug case)
 * Same pattern as SidebarActionButtons notification badge
 */
function Scenario02_CircleBadge() {
  const [count, setCount] = useState(0)
  const tracker = useOpacityTracker('02', 'enter-exit-02-target')
  const countString = count > 0 ? `${count}` : ''

  const handleIncrement = () => {
    tracker.startTracking()
    setCount((c) => c + 1)
    setTimeout(() => {
      tracker.stopTracking()
      if (typeof window !== 'undefined') {
        window.__enterExitReady['02'] = true
      }
    }, 1000)
  }

  const handleClear = () => {
    tracker.startTracking()
    setCount(0)
    setTimeout(() => {
      tracker.stopTracking()
      if (typeof window !== 'undefined') {
        window.__enterExitReady['02-exit'] = true
      }
    }, 1000)
  }

  return (
    <YStack gap="$2">
      <Paragraph size="$2">Scenario 02: Circle badge (real-world case)</Paragraph>
      <XStack gap="$2">
        <Button testID="enter-exit-02-increment" onPress={handleIncrement}>
          Add
        </Button>
        <Button testID="enter-exit-02-clear" onPress={handleClear}>
          Clear
        </Button>
      </XStack>
      <XStack height={40} items="center" position="relative">
        <AnimatePresence>
          {countString ? (
            <Circle
              key="count-badge"
              testID="enter-exit-02-target"
              transition="medium"
              bg="$color12"
              size={24}
              position="absolute"
              items="center"
              justify="center"
              enterStyle={{
                opacity: 0,
                y: -3,
              }}
              exitStyle={{
                opacity: 0,
                y: -3,
              }}
            >
              <Text color="$color1" fontFamily="$mono" fontSize={12}>
                {countString}
              </Text>
            </Circle>
          ) : null}
        </AnimatePresence>
      </XStack>
    </YStack>
  )
}
