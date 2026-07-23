import { useConfiguration } from '@tamagui/core'
import { useRef } from 'react'
import { Button, Paragraph, View, YStack } from 'tamagui'

const ITEM_COUNT = 100

export function MotionLinkedBenchmarkCase() {
  const driver = useConfiguration().animationDriver!
  const AnimatedView = driver.View ?? View
  const value = driver.useAnimatedNumber(0)
  const open = useRef(false)
  const run = useRef(0)
  const runNode = useRef<HTMLElement | null>(null)
  const style = driver.useAnimatedNumberStyle(value, (current: number) => ({
    transform: [{ translateX: current }],
  }))

  return (
    <YStack padding="$4" gap="$3">
      <Button
        data-testid="motion-linked-trigger"
        onPress={() => {
          performance.clearMarks('tamagui-motion-style-split')
          performance.mark('motion-linked-start')
          open.current = !open.current
          value.setValue(
            open.current ? 120 : 0,
            { type: 'timing', duration: 300 },
            () => {
              performance.mark('motion-linked-end')
              performance.measure(
                'motion-linked-100',
                'motion-linked-start',
                'motion-linked-end'
              )
              run.current++
              if (runNode.current) runNode.current.textContent = String(run.current)
            }
          )
        }}
      >
        Run 100 linked nodes
      </Button>
      <Paragraph ref={runNode as any} data-testid="motion-linked-run">
        0
      </Paragraph>
      <YStack gap={1}>
        {Array.from({ length: ITEM_COUNT }, (_, index) => (
          <AnimatedView
            key={index}
            debug="profile"
            data-testid={index === 0 ? 'motion-linked-first' : undefined}
            style={[{ width: 2, height: 2, backgroundColor: 'red' }, style]}
          />
        ))}
      </YStack>
    </YStack>
  )
}
