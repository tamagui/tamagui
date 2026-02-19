import { useState } from 'react'
import { Button, Square, YStack, Paragraph } from 'tamagui'
import { AnimatePresence } from '@tamagui/animate-presence'

// test case: animateOnly=[] should complete exit immediately
// tests the useInsertionEffect fix for the race condition

export function AnimatePresenceExitTest() {
  const [visible, setVisible] = useState(true)
  const [exitCount, setExitCount] = useState(0)
  const [exitTime, setExitTime] = useState<number | null>(null)
  const [startTime, setStartTime] = useState<number | null>(null)

  const handleToggle = () => {
    if (visible) {
      setStartTime(Date.now())
    }
    setVisible(!visible)
  }

  const handleExitComplete = () => {
    const elapsed = startTime ? Date.now() - startTime : 0
    setExitTime(elapsed)
    setExitCount((c) => c + 1)
    console.log(`[EXIT_COMPLETE] elapsed=${elapsed}ms count=${exitCount + 1}`)
  }

  const passed = exitTime !== null && exitTime < 100

  return (
    <YStack flex={1} alignItems="center" justifyContent="center" gap="$4" padding="$4">
      <Paragraph size="$6" fontWeight="bold">
        AnimatePresence Exit Test
      </Paragraph>

      <Paragraph textAlign="center" maxWidth={300}>
        animateOnly=[] should complete exit immediately
      </Paragraph>

      <Button onPress={handleToggle}>{visible ? 'Hide (trigger exit)' : 'Show'}</Button>

      <YStack height={100} alignItems="center" justifyContent="center">
        <AnimatePresence onExitComplete={handleExitComplete}>
          {visible && (
            <Square
              key="test-square"
              transition="300ms"
              animateOnly={[]}
              size={60}
              bg="$blue10"
              exitStyle={{ opacity: 0, scale: 0.5 }}
            />
          )}
        </AnimatePresence>
      </YStack>

      <YStack gap="$2" alignItems="center">
        <Paragraph>Exit count: {exitCount}</Paragraph>
        <Paragraph>Exit time: {exitTime !== null ? `${exitTime}ms` : 'N/A'}</Paragraph>
        <Paragraph
          color={passed ? '$green10' : exitTime !== null ? '$red10' : '$gray10'}
          fontWeight="bold"
        >
          {exitTime !== null ? (passed ? '✓ PASS' : '✗ FAIL') : 'Tap Hide to test'}
        </Paragraph>
      </YStack>
    </YStack>
  )
}
