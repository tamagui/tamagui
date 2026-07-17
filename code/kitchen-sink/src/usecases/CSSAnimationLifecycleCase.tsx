import { AnimatePresence } from '@tamagui/animate-presence'
import { useConfiguration } from '@tamagui/core'
import { useRef, useState } from 'react'
import { Button, Paragraph, Square, YStack } from 'tamagui'

function LinkedValue({ value }: { value: any }) {
  const { useAnimatedNumberStyle } = useConfiguration().animationDriver!
  const renders = useRef(0)
  renders.current++
  const style = useAnimatedNumberStyle(value, (current: number) => ({ opacity: current }))

  return (
    <Paragraph data-testid="css-linked-value">
      {Number(style.opacity).toFixed(3)}:{renders.current}
    </Paragraph>
  )
}

function AnimatedNumberLifecycle() {
  const driver = useConfiguration().animationDriver!
  const value = driver.useAnimatedNumber(0)
  const renders = useRef(0)
  const samples = useRef<number[]>([])
  const hostRef = useRef<any>(null)
  const [finished, setFinished] = useState(false)
  renders.current++

  const hostStyle = driver.useAnimatedNumberStyle(value, (current: number) => ({
    opacity: current,
  }))

  driver.useAnimatedNumberReaction({ value, hostRef }, (current) => {
    samples.current.push(current)
  })

  return (
    <YStack gap="$2">
      <Button
        data-testid="css-number-trigger"
        onPress={() => {
          samples.current = []
          setFinished(false)
          value.setValue(1, { type: 'timing', duration: 300 }, () => setFinished(true))
        }}
      >
        Animate number
      </Button>
      <Paragraph data-testid="css-host-value">{Number(hostStyle.opacity)}</Paragraph>
      <Paragraph data-testid="css-host-renders">{renders.current}</Paragraph>
      <LinkedValue value={value} />
      <Paragraph data-testid="css-number-finished">{String(finished)}</Paragraph>
      <Paragraph data-testid="css-number-samples">
        {samples.current.map((sample) => sample.toFixed(3)).join(',')}
      </Paragraph>
    </YStack>
  )
}

function ExitUsingBrowserAnimations() {
  const [visible, setVisible] = useState(true)
  const [elapsed, setElapsed] = useState<number | null>(null)
  const targetRef = useRef<HTMLElement | null>(null)
  const startedAt = useRef(0)

  const close = () => {
    targetRef.current?.animate([{ filter: 'blur(0px)' }, { filter: 'blur(1px)' }], {
      duration: 100,
    })
    startedAt.current = performance.now()
    setVisible(false)
  }

  return (
    <YStack gap="$2">
      <Button data-testid="css-waapi-exit-trigger" onPress={close}>
        Close
      </Button>
      <AnimatePresence
        onExitComplete={() =>
          setElapsed(Math.round(performance.now() - startedAt.current))
        }
      >
        {visible && (
          <Square
            ref={targetRef as any}
            key="waapi-exit"
            data-testid="css-waapi-exit-target"
            size={40}
            opacity={1}
            transition="slow"
            exitStyle={{ opacity: 1 }}
          />
        )}
      </AnimatePresence>
      <Paragraph data-testid="css-waapi-exit-elapsed">{elapsed ?? ''}</Paragraph>
    </YStack>
  )
}

export function CSSAnimationLifecycleCase() {
  return (
    <YStack padding="$4" gap="$6">
      <AnimatedNumberLifecycle />
      <ExitUsingBrowserAnimations />
    </YStack>
  )
}
