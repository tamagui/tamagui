import { AnimatePresence } from '@tamagui/animate-presence'
import { useState } from 'react'
import { Paragraph, Square, XStack, YStack } from 'tamagui'
import { Button } from '../components/Button'

/**
 * onTransition lifecycle test
 *
 * Exercises the typed onTransition callback across enter, exit, and in-place
 * update transitions, plus finished:false on an interrupted update. Events are
 * logged per scenario to window for the OnTransition.animated.test.tsx suite.
 */

type TransitionEvent = {
  phase: 'start' | 'end'
  cause: 'enter' | 'exit' | 'update'
  finished?: boolean
}

type LoggedEvent = TransitionEvent & { t: number }

declare global {
  interface Window {
    __onTransitionEvents: Record<string, LoggedEvent[]>
    __resetOnTransition: (id?: string) => void
  }
}

if (typeof window !== 'undefined') {
  window.__onTransitionEvents ||= {}
  window.__resetOnTransition = (id?: string) => {
    if (id) {
      window.__onTransitionEvents[id] = []
    } else {
      window.__onTransitionEvents = {}
    }
  }
}

function log(id: string, event: TransitionEvent) {
  if (typeof window === 'undefined') return
  window.__onTransitionEvents[id] ||= []
  window.__onTransitionEvents[id].push({
    phase: event.phase,
    cause: event.cause,
    finished: event.finished,
    t: performance.now(),
  })
}

export function OnTransitionCase() {
  return (
    <YStack gap="$4" padding="$4">
      <Paragraph fontWeight="bold" fontSize="$5">
        onTransition lifecycle
      </Paragraph>
      <EnterExitScenario />
      <UpdateScenario />
      <InterruptScenario />
    </YStack>
  )
}

// enter + exit via AnimatePresence mount/unmount
function EnterExitScenario() {
  const [visible, setVisible] = useState(false)

  return (
    <XStack gap="$3" alignItems="center" minHeight={80}>
      <Button
        onPress={() => setVisible((v) => !v)}
        testID="enterexit-toggle"
        data-testid="enterexit-toggle"
      >
        Toggle enter/exit
      </Button>
      <AnimatePresence>
        {visible && (
          <Square
            key="enterexit-box"
            testID="enterexit-box"
            data-testid="enterexit-box"
            size={60}
            bg="$blue10"
            transition="300ms"
            opacity={1}
            enterStyle={{ opacity: 0, scale: 0.8 }}
            exitStyle={{ opacity: 0, scale: 0.8 }}
            onTransition={(e) => log('enterexit', e)}
          />
        )}
      </AnimatePresence>
    </XStack>
  )
}

// in-place update: change opacity + scale while mounted
function UpdateScenario() {
  const [on, setOn] = useState(false)

  return (
    <XStack gap="$3" alignItems="center" minHeight={80}>
      <Button
        onPress={() => setOn((v) => !v)}
        testID="update-toggle"
        data-testid="update-toggle"
      >
        Toggle update
      </Button>
      <Square
        testID="update-box"
        data-testid="update-box"
        size={60}
        bg="$green10"
        transition="300ms"
        opacity={on ? 0.5 : 1}
        scale={on ? 0.8 : 1}
        onTransition={(e) => log('update', e)}
      />
    </XStack>
  )
}

// interrupted update: change target twice in quick succession so the first
// update is superseded before it finishes, producing finished:false
function InterruptScenario() {
  const [step, setStep] = useState(0)

  const handleInterrupt = () => {
    setStep((s) => s + 1)
    // supersede the first update while it is still animating
    setTimeout(() => setStep((s) => s + 1), 80)
  }

  // distinct scale per step so each change is a genuine update
  const scale = 1 - (step % 2) * 0.3

  return (
    <XStack gap="$3" alignItems="center" minHeight={80}>
      <Button
        onPress={handleInterrupt}
        testID="interrupt-trigger"
        data-testid="interrupt-trigger"
      >
        Interrupt update
      </Button>
      <Square
        testID="interrupt-box"
        data-testid="interrupt-box"
        size={60}
        bg="$red10"
        transition="500ms"
        scale={scale}
        onTransition={(e) => log('interrupt', e)}
      />
    </XStack>
  )
}
