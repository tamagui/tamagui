import { useState, useRef, useCallback } from 'react'
import { AnimatePresence } from '@tamagui/animate-presence'
import { Button, Circle, Paragraph, Popover, Square, Text, XStack, YStack } from 'tamagui'

/**
 * Tests that enter clause/exit clause actually animate (opacity changes)
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
    <YStack gap="4" padding="4">
      <Paragraph fontWeight="bold" fontSize="5">
        AnimatePresence Enter/Exit Animation Test
      </Paragraph>

      <Scenario01_BasicEnterExit />
      <Scenario02_CircleBadge />
      <Scenario03_InitialFalse />
      <Scenario04_ExitScale />
      <Scenario05_PopoverExitScale />
    </YStack>
  )
}

/**
 * Scenario 01: basic square with enter clause/exit clause opacity
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
    <YStack gap="2">
      <Paragraph size="2">Scenario 01: Basic enter/exit opacity</Paragraph>
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
              bg="blue-600"
              opacity="enter:0 exit:0"
              size={60}
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
    <YStack gap="2">
      <Paragraph size="2">Scenario 03: initial=false (exact real-world case)</Paragraph>
      <XStack gap="2">
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
              bg="color-11"
              position="absolute"
              t={4}
              r={6}
              items="center"
              justify="center"
              opacity="enter:0 exit:0"
              y="enter:-3px exit:-3px"
              size={16}
            >
              <Text color="color-1" fontFamily="monospace" fontSize={10} lineHeight={10}>
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
    <YStack gap="2">
      <Paragraph size="2">Scenario 02: Circle badge (real-world case)</Paragraph>
      <XStack gap="2">
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
              bg="color-11"
              position="absolute"
              items="center"
              justify="center"
              opacity="enter:0 exit:0"
              y="enter:-3px exit:-3px"
              size={24}
            >
              <Text color="color-1" fontFamily="monospace" fontSize={12}>
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
 * Scenario 04: exit clauses on transform props. `scale` and `y` are emitted
 * as the individual css `scale` and `translate` properties, so an exit has
 * to animate those, not only opacity and `transform`.
 */
function Scenario04_ExitScale() {
  const [show, setShow] = useState(true)
  const rafRef = useRef<number>(0)

  const handleToggle = () => {
    if (typeof window !== 'undefined') {
      window.__enterExitFrames['04-scale'] = []
      window.__enterExitFrames['04-translate'] = []
      const track = () => {
        const el = document.querySelector('[data-testid="enter-exit-04-target"]')
        if (el) {
          // effective values: the individual `scale` / `translate` properties
          // composed with whatever the `transform` matrix carries
          const computed = getComputedStyle(el)
          const matrix = computed.transform.match(/matrix\(([^)]+)\)/)
          const m = matrix ? matrix[1].split(',').map(Number) : [1, 0, 0, 1, 0, 0]
          const scale = (parseFloat(computed.scale) || 1) * m[0]
          const translate = computed.translate.split(' ')[1] ?? computed.translate
          window.__enterExitFrames['04-scale'].push(scale)
          window.__enterExitFrames['04-translate'].push(
            (parseFloat(translate) || 0) + m[5]
          )
        }
        rafRef.current = requestAnimationFrame(track)
      }
      rafRef.current = requestAnimationFrame(track)
    }
    setShow((v) => !v)
    setTimeout(() => {
      cancelAnimationFrame(rafRef.current)
      if (typeof window !== 'undefined') {
        window.__enterExitReady['04'] = true
      }
    }, 1000)
  }

  return (
    <YStack gap="2">
      <Paragraph size="2">Scenario 04: exit scale and translate</Paragraph>
      <Button testID="enter-exit-04-trigger" onPress={handleToggle}>
        Toggle
      </Button>
      <XStack height={80} items="center">
        <AnimatePresence>
          {show ? (
            <Square
              key="test-square"
              testID="enter-exit-04-target"
              transition={{ preset: 'medium', properties: 'transform, opacity' }}
              bg="blue-600"
              opacity="1 exit:0"
              y="enter:-8px exit:4px"
              scale="enter:0.95 exit:0.95"
              size={60}
            />
          ) : null}
        </AnimatePresence>
      </XStack>
    </YStack>
  )
}

/**
 * Scenario 05: the same exit clauses on a positioned Popover.Content, whose
 * popper drives translate itself
 */
function Scenario05_PopoverExitScale() {
  const [open, setOpen] = useState(false)
  const rafRef = useRef<number>(0)

  const track = () => {
    if (typeof window === 'undefined') return
    window.__enterExitFrames['05-scale'] = []
    const step = () => {
      const el = document.querySelector('[data-testid="enter-exit-05-target"]')
      if (el) {
        const computed = getComputedStyle(el)
        const matrix = computed.transform.match(/matrix\(([^)]+)\)/)
        const m = matrix ? matrix[1].split(',').map(Number) : [1, 0, 0, 1, 0, 0]
        window.__enterExitFrames['05-scale'].push(
          (parseFloat(computed.scale) || 1) * m[0]
        )
      }
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    setTimeout(() => {
      cancelAnimationFrame(rafRef.current)
      window.__enterExitReady['05'] = true
    }, 1000)
  }

  return (
    <YStack gap="2">
      <Paragraph size="2">Scenario 05: popover exit scale</Paragraph>
      <Popover open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button
            testID="enter-exit-05-trigger"
            onPress={() => {
              if (open) track()
              setOpen(!open)
            }}
          >
            Toggle popover
          </Button>
        </Popover.Trigger>
        <Popover.Content
          testID="enter-exit-05-target"
          animatePosition
          transition={{ preset: 'medium', properties: 'transform, opacity' }}
          opacity="1 exit:0"
          y="enter:-8px exit:4px"
          scale="enter:0.95 exit:0.95"
          bg="blue-600"
          p="4"
        >
          <Text>content</Text>
        </Popover.Content>
      </Popover>
    </YStack>
  )
}
