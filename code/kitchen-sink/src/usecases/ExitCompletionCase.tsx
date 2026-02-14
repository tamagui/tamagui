import { useState, useRef, useCallback, useEffect } from 'react'
import { AnimatePresence } from '@tamagui/animate-presence'
import { Button, Paragraph, Square, XStack, YStack, View } from 'tamagui'

/**
 * EXIT COMPLETION TEST SUITE
 *
 * Tests exit animation completion invariants:
 * 1. sendExitComplete is called exactly once per exit cycle
 * 2. Completion fires only after animations actually finish
 * 3. Interrupted/canceled animations don't cause premature completion
 * 4. Zero-duration animations complete correctly
 * 5. Rapid re-renders during exit don't cause duplicate completions
 *
 * Each scenario logs completion events for verification:
 * [EXIT_COMPLETE] scenario:<id> count:<n> time:<ms>
 */

// helper to expose completion tracking to window for test access
declare global {
  interface Window {
    __exitCompletionCounts: Record<string, number>
    __exitCompletionTimes: Record<string, number[]>
    __resetExitTracking: () => void
  }
}

if (typeof window !== 'undefined') {
  window.__exitCompletionCounts = {}
  window.__exitCompletionTimes = {}
  window.__resetExitTracking = () => {
    window.__exitCompletionCounts = {}
    window.__exitCompletionTimes = {}
  }
}

function useExitTracker(scenarioId: string) {
  const countRef = useRef(0)
  const startTimeRef = useRef(0)

  const startExit = useCallback(() => {
    countRef.current = 0
    startTimeRef.current = Date.now()
    if (typeof window !== 'undefined') {
      window.__exitCompletionCounts[scenarioId] = 0
      window.__exitCompletionTimes[scenarioId] = []
    }
    console.log(`[EXIT_START] scenario:${scenarioId} time:${startTimeRef.current}`)
  }, [scenarioId])

  const onExitComplete = useCallback(() => {
    countRef.current++
    const elapsed = Date.now() - startTimeRef.current
    if (typeof window !== 'undefined') {
      window.__exitCompletionCounts[scenarioId] = countRef.current
      window.__exitCompletionTimes[scenarioId] = window.__exitCompletionTimes[scenarioId] || []
      window.__exitCompletionTimes[scenarioId].push(elapsed)
    }
    console.log(
      `[EXIT_COMPLETE] scenario:${scenarioId} count:${countRef.current} time:${elapsed}ms`
    )
  }, [scenarioId])

  return { startExit, onExitComplete, getCount: () => countRef.current }
}

export function ExitCompletionCase() {
  return (
    <YStack gap="$2" padding="$2" flex={1} overflow="scroll">
      <Paragraph fontWeight="bold" fontSize="$5">
        Exit Completion Test Suite
      </Paragraph>
      <Paragraph size="$2" color="$color10">
        Tests sendExitComplete invariants. Check console for [EXIT_COMPLETE] logs.
      </Paragraph>

      <SectionHeader>1. Basic Exit Completion</SectionHeader>
      <Scenario01_BasicExit />
      <Scenario02_ZeroDuration />
      <Scenario03_VeryShortDuration />

      <SectionHeader>2. Duplicate Completion Guards</SectionHeader>
      <Scenario04_RapidToggle />
      <Scenario05_ReRenderDuringExit />
      <Scenario06_MultipleChildren />

      <SectionHeader>3. Timing Validation</SectionHeader>
      <Scenario07_LongAnimation />
      <Scenario08_InterruptedExit />
      <Scenario09_CanceledAndRestarted />

      <SectionHeader>4. Per-Property Exit</SectionHeader>
      <Scenario10_PerPropertyExit />
      <Scenario11_MixedDurationExit />

      <SectionHeader>5. AnimateOnly & Transform Sub-Keys</SectionHeader>
      <Scenario51_AnimateOnlyExclusion />
      <Scenario53_TransformSubKeySplitDurations />
      <Scenario55_ZeroAnimatableExitProps />
    </YStack>
  )
}

const SectionHeader = ({ children }: { children: string }) => (
  <Paragraph fontWeight="bold" fontSize="$3" marginTop="$3" color="$blue10">
    {children}
  </Paragraph>
)

// ============================================================================
// SCENARIO 01: Basic Exit - should complete exactly once
// ============================================================================
function Scenario01_BasicExit() {
  const [visible, setVisible] = useState(true)
  const { startExit, onExitComplete } = useExitTracker('01-basic-exit')

  return (
    <XStack gap="$2" alignItems="center" minHeight={50}>
      <Button
        size="$2"
        onPress={() => {
          if (visible) startExit()
          setVisible(!visible)
        }}
        testID="exit-01-trigger"
        data-testid="exit-01-trigger"
      >
        01: Basic Exit
      </Button>
      <AnimatePresence onExitComplete={onExitComplete}>
        {visible && (
          <Square
            key="basic-exit"
            transition="300ms"
            size={40}
            bg="$blue10"
            exitStyle={{ opacity: 0, scale: 0.5 }}
            testID="exit-01-target"
            data-testid="exit-01-target"
          />
        )}
      </AnimatePresence>
      <Paragraph size="$1" testID="exit-01-status" data-testid="exit-01-status">
        {visible ? 'visible' : 'hidden'}
      </Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 02: Zero Duration - edge case that can race
// Tests finding #3: race where callbacks fire before keys registered
// ============================================================================
function Scenario02_ZeroDuration() {
  const [visible, setVisible] = useState(true)
  const { startExit, onExitComplete } = useExitTracker('02-zero-duration')

  return (
    <XStack gap="$2" alignItems="center" minHeight={50}>
      <Button
        size="$2"
        onPress={() => {
          if (visible) startExit()
          setVisible(!visible)
        }}
        testID="exit-02-trigger"
        data-testid="exit-02-trigger"
      >
        02: Zero Duration
      </Button>
      <AnimatePresence onExitComplete={onExitComplete}>
        {visible && (
          <Square
            key="zero-duration"
            transition="0ms"
            size={40}
            bg="$green10"
            exitStyle={{ opacity: 0 }}
            testID="exit-02-target"
            data-testid="exit-02-target"
          />
        )}
      </AnimatePresence>
      <Paragraph size="$1">{visible ? 'visible' : 'hidden'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 03: Very Short Duration (30ms) - another race edge case
// ============================================================================
function Scenario03_VeryShortDuration() {
  const [visible, setVisible] = useState(true)
  const { startExit, onExitComplete } = useExitTracker('03-short-duration')

  return (
    <XStack gap="$2" alignItems="center" minHeight={50}>
      <Button
        size="$2"
        onPress={() => {
          if (visible) startExit()
          setVisible(!visible)
        }}
        testID="exit-03-trigger"
        data-testid="exit-03-trigger"
      >
        03: 30ms Duration
      </Button>
      <AnimatePresence onExitComplete={onExitComplete}>
        {visible && (
          <Square
            key="short-duration"
            transition="30ms"
            size={40}
            bg="$yellow10"
            exitStyle={{ opacity: 0, scale: 0.8 }}
            testID="exit-03-target"
            data-testid="exit-03-target"
          />
        )}
      </AnimatePresence>
      <Paragraph size="$1">{visible ? 'visible' : 'hidden'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 04: Rapid Toggle - tests finding #4/#5: duplicate completions
// Rapidly toggle visibility to stress test the exit cycle guards
// ============================================================================
function Scenario04_RapidToggle() {
  const [visible, setVisible] = useState(true)
  const { startExit, onExitComplete } = useExitTracker('04-rapid-toggle')

  const handleRapidToggle = () => {
    startExit()
    // toggle off
    setVisible(false)
    // toggle back on quickly (before exit completes)
    setTimeout(() => setVisible(true), 50)
    // toggle off again
    setTimeout(() => setVisible(false), 100)
  }

  return (
    <XStack gap="$2" alignItems="center" minHeight={50}>
      <Button
        size="$2"
        onPress={handleRapidToggle}
        testID="exit-04-trigger"
        data-testid="exit-04-trigger"
      >
        04: Rapid Toggle
      </Button>
      <AnimatePresence onExitComplete={onExitComplete}>
        {visible && (
          <Square
            key="rapid-toggle"
            transition="200ms"
            size={40}
            bg="$red10"
            exitStyle={{ opacity: 0, scale: 0.5 }}
            testID="exit-04-target"
            data-testid="exit-04-target"
          />
        )}
      </AnimatePresence>
      <Paragraph size="$1" testID="exit-04-status" data-testid="exit-04-status">
        {visible ? 'visible' : 'hidden'}
      </Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 05: Re-render During Exit - tests finding #4: flush restart
// Force re-renders during exit animation via unrelated state
// ============================================================================
function Scenario05_ReRenderDuringExit() {
  const [visible, setVisible] = useState(true)
  const [counter, setCounter] = useState(0)
  const { startExit, onExitComplete } = useExitTracker('05-rerender-during-exit')

  const handleExitWithRerenders = () => {
    startExit()
    setVisible(false)
    // force multiple re-renders during exit
    setTimeout(() => setCounter((c) => c + 1), 50)
    setTimeout(() => setCounter((c) => c + 1), 100)
    setTimeout(() => setCounter((c) => c + 1), 150)
  }

  return (
    <XStack gap="$2" alignItems="center" minHeight={50}>
      <Button
        size="$2"
        onPress={handleExitWithRerenders}
        testID="exit-05-trigger"
        data-testid="exit-05-trigger"
      >
        05: Rerender During
      </Button>
      <AnimatePresence onExitComplete={onExitComplete}>
        {visible && (
          <Square
            key="rerender-exit"
            transition="300ms"
            size={40}
            bg="$blue10"
            exitStyle={{ opacity: 0, y: 20 }}
            testID="exit-05-target"
            data-testid="exit-05-target"
          />
        )}
      </AnimatePresence>
      <Paragraph size="$1">
        counter: {counter} | {visible ? 'visible' : 'hidden'}
      </Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 06: Multiple Children Exiting - each should complete once
// ============================================================================
function Scenario06_MultipleChildren() {
  const [items, setItems] = useState([1, 2, 3])
  const { startExit, onExitComplete } = useExitTracker('06-multiple-children')

  const handleRemoveAll = () => {
    startExit()
    setItems([])
  }

  const handleReset = () => {
    setItems([1, 2, 3])
  }

  return (
    <XStack gap="$2" alignItems="center" minHeight={50}>
      <Button
        size="$2"
        onPress={handleRemoveAll}
        testID="exit-06-trigger"
        data-testid="exit-06-trigger"
      >
        06: Remove All
      </Button>
      <Button size="$2" onPress={handleReset}>
        Reset
      </Button>
      <AnimatePresence onExitComplete={onExitComplete}>
        {items.map((id) => (
          <Square
            key={`multi-${id}`}
            transition="200ms"
            size={30}
            bg="$green10"
            exitStyle={{ opacity: 0, scale: 0.5 }}
            testID={`exit-06-target-${id}`}
            data-testid={`exit-06-target-${id}`}
          />
        ))}
      </AnimatePresence>
      <Paragraph size="$1">count: {items.length}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 07: Long Animation - verify completion timing
// 500ms animation should not complete before ~500ms
// ============================================================================
function Scenario07_LongAnimation() {
  const [visible, setVisible] = useState(true)
  const { startExit, onExitComplete } = useExitTracker('07-long-animation')

  return (
    <XStack gap="$2" alignItems="center" minHeight={50}>
      <Button
        size="$2"
        onPress={() => {
          if (visible) startExit()
          setVisible(!visible)
        }}
        testID="exit-07-trigger"
        data-testid="exit-07-trigger"
      >
        07: 500ms Exit
      </Button>
      <AnimatePresence onExitComplete={onExitComplete}>
        {visible && (
          <Square
            key="long-anim"
            transition="500ms"
            size={40}
            bg="$yellow10"
            exitStyle={{ opacity: 0, scale: 0.5, y: 30 }}
            testID="exit-07-target"
            data-testid="exit-07-target"
          />
        )}
      </AnimatePresence>
      <Paragraph size="$1">{visible ? 'visible' : 'hidden'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 08: Interrupted Exit - tests finding #2: canceled = completed
// Start exit, then cancel by showing again, then exit again
// Should only get ONE completion for the final successful exit
// ============================================================================
function Scenario08_InterruptedExit() {
  const [visible, setVisible] = useState(true)
  const { startExit, onExitComplete } = useExitTracker('08-interrupted')

  const handleInterruptedExit = () => {
    startExit()
    // start exiting
    setVisible(false)
    // interrupt by showing again after 100ms (during 300ms animation)
    setTimeout(() => setVisible(true), 100)
    // then exit for real after 200ms
    setTimeout(() => setVisible(false), 200)
  }

  return (
    <XStack gap="$2" alignItems="center" minHeight={50}>
      <Button
        size="$2"
        onPress={handleInterruptedExit}
        testID="exit-08-trigger"
        data-testid="exit-08-trigger"
      >
        08: Interrupted
      </Button>
      <AnimatePresence onExitComplete={onExitComplete}>
        {visible && (
          <Square
            key="interrupted"
            transition="300ms"
            size={40}
            bg="$red10"
            exitStyle={{ opacity: 0, scale: 0.5 }}
            testID="exit-08-target"
            data-testid="exit-08-target"
          />
        )}
      </AnimatePresence>
      <Paragraph size="$1" testID="exit-08-status" data-testid="exit-08-status">
        {visible ? 'visible' : 'hidden'}
      </Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 09: Canceled and Restarted Multiple Times
// Extreme stress test: cancel/restart exit 5 times
// ============================================================================
function Scenario09_CanceledAndRestarted() {
  const [visible, setVisible] = useState(true)
  const { startExit, onExitComplete } = useExitTracker('09-cancel-restart')

  const handleStressTest = () => {
    startExit()
    // rapid cancel/restart cycle
    setVisible(false)
    setTimeout(() => setVisible(true), 30)
    setTimeout(() => setVisible(false), 60)
    setTimeout(() => setVisible(true), 90)
    setTimeout(() => setVisible(false), 120)
    setTimeout(() => setVisible(true), 150)
    // final exit
    setTimeout(() => setVisible(false), 180)
  }

  return (
    <XStack gap="$2" alignItems="center" minHeight={50}>
      <Button
        size="$2"
        onPress={handleStressTest}
        testID="exit-09-trigger"
        data-testid="exit-09-trigger"
      >
        09: Stress Test
      </Button>
      <AnimatePresence onExitComplete={onExitComplete}>
        {visible && (
          <Square
            key="stress"
            transition="200ms"
            size={40}
            bg="$blue10"
            exitStyle={{ opacity: 0, x: -20 }}
            testID="exit-09-target"
            data-testid="exit-09-target"
          />
        )}
      </AnimatePresence>
      <Paragraph size="$1" testID="exit-09-status" data-testid="exit-09-status">
        {visible ? 'visible' : 'hidden'}
      </Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 10: Per-Property Exit - tests finding #1: emitter-driven keys
// Different properties have different durations during exit
// Completion should wait for the LONGEST one
// ============================================================================
function Scenario10_PerPropertyExit() {
  const [visible, setVisible] = useState(true)
  const { startExit, onExitComplete } = useExitTracker('10-per-property')

  return (
    <XStack gap="$2" alignItems="center" minHeight={50}>
      <Button
        size="$2"
        onPress={() => {
          if (visible) startExit()
          setVisible(!visible)
        }}
        testID="exit-10-trigger"
        data-testid="exit-10-trigger"
      >
        10: Per-Property
      </Button>
      <AnimatePresence onExitComplete={onExitComplete}>
        {visible && (
          <Square
            key="per-prop"
            // opacity=100ms (fast), scale=500ms (slow)
            transition={['100ms', { scale: '500ms' }] as any}
            size={40}
            bg="$green10"
            exitStyle={{ opacity: 0, scale: 0.5 }}
            testID="exit-10-target"
            data-testid="exit-10-target"
          />
        )}
      </AnimatePresence>
      <Paragraph size="$1">{visible ? 'visible' : 'hidden'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 11: Mixed Duration with Transform Exit
// opacity=100ms, transform properties=400ms
// Should complete after ~400ms, not 100ms
// ============================================================================
function Scenario11_MixedDurationExit() {
  const [visible, setVisible] = useState(true)
  const { startExit, onExitComplete } = useExitTracker('11-mixed-duration')

  return (
    <XStack gap="$2" alignItems="center" minHeight={50}>
      <Button
        size="$2"
        onPress={() => {
          if (visible) startExit()
          setVisible(!visible)
        }}
        testID="exit-11-trigger"
        data-testid="exit-11-trigger"
      >
        11: Mixed Duration
      </Button>
      <AnimatePresence onExitComplete={onExitComplete}>
        {visible && (
          <Square
            key="mixed"
            transition={
              { opacity: '100ms', scale: '400ms', default: '400ms' } as any
            }
            size={40}
            bg="$yellow10"
            exitStyle={{ opacity: 0, scale: 0.5, y: 20 }}
            testID="exit-11-target"
            data-testid="exit-11-target"
          />
        )}
      </AnimatePresence>
      <Paragraph size="$1">{visible ? 'visible' : 'hidden'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 51: AnimateOnly Exclusion
// animateOnly=['opacity'] should exclude scale from pending set
// Even if scale has a long exit config (500ms), should complete based on opacity (100ms)
// Tests: pending-set only includes keys in animateOnly filter
// ============================================================================
function Scenario51_AnimateOnlyExclusion() {
  const [visible, setVisible] = useState(true)
  const { startExit, onExitComplete } = useExitTracker('51-animateonly-exclusion')

  return (
    <XStack gap="$2" alignItems="center" minHeight={50}>
      <Button
        size="$2"
        onPress={() => {
          if (visible) startExit()
          setVisible(!visible)
        }}
        testID="exit-51-trigger"
        data-testid="exit-51-trigger"
      >
        51: AnimateOnly
      </Button>
      <AnimatePresence onExitComplete={onExitComplete}>
        {visible && (
          <Square
            key="animateonly-exclusion"
            transition={{ opacity: '100ms', scale: '500ms', default: '500ms' } as any}
            animateOnly={['opacity']}
            size={40}
            bg="$purple10"
            exitStyle={{ opacity: 0, scale: 0.5 }}
            testID="exit-51-target"
            data-testid="exit-51-target"
          />
        )}
      </AnimatePresence>
      <Paragraph size="$1">{visible ? 'visible' : 'hidden'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 53: Transform Sub-Key Split Durations
// scale=100ms, y=500ms - completion should wait for y (500ms)
// Tests: transform sub-keys (scale, y) tracked individually
// ============================================================================
function Scenario53_TransformSubKeySplitDurations() {
  const [visible, setVisible] = useState(true)
  const { startExit, onExitComplete } = useExitTracker('53-transform-subkeys')

  return (
    <XStack gap="$2" alignItems="center" minHeight={50}>
      <Button
        size="$2"
        onPress={() => {
          if (visible) startExit()
          setVisible(!visible)
        }}
        testID="exit-53-trigger"
        data-testid="exit-53-trigger"
      >
        53: Transform Sub-Keys
      </Button>
      <AnimatePresence onExitComplete={onExitComplete}>
        {visible && (
          <Square
            key="transform-subkeys"
            transition={{ scale: '100ms', y: '500ms', default: '100ms' } as any}
            size={40}
            bg="$orange10"
            exitStyle={{ scale: 0.5, y: 50 }}
            testID="exit-53-target"
            data-testid="exit-53-target"
          />
        )}
      </AnimatePresence>
      <Paragraph size="$1">{visible ? 'visible' : 'hidden'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 55: Zero Animatable Exit Props
// exitStyle exists but no animatable properties (only static props)
// Should complete immediately (no animations to wait for)
// Tests: immediate completion code path
// ============================================================================
function Scenario55_ZeroAnimatableExitProps() {
  const [visible, setVisible] = useState(true)
  const { startExit, onExitComplete } = useExitTracker('55-zero-animatable')

  return (
    <XStack gap="$2" alignItems="center" minHeight={50}>
      <Button
        size="$2"
        onPress={() => {
          if (visible) startExit()
          setVisible(!visible)
        }}
        testID="exit-55-trigger"
        data-testid="exit-55-trigger"
      >
        55: Zero Animatable
      </Button>
      <AnimatePresence onExitComplete={onExitComplete}>
        {visible && (
          <Square
            key="zero-animatable"
            transition="300ms"
            animateOnly={[]}
            size={40}
            bg="$gray10"
            exitStyle={{ opacity: 0, scale: 0.5 }}
            testID="exit-55-target"
            data-testid="exit-55-target"
          />
        )}
      </AnimatePresence>
      <Paragraph size="$1">{visible ? 'visible' : 'hidden'}</Paragraph>
    </XStack>
  )
}
