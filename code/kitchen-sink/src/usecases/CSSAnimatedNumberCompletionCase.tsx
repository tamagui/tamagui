import { useConfiguration } from '@tamagui/core'
import { useRef, useState } from 'react'
import { Button, Paragraph, YStack } from 'tamagui'

/**
 * proves the animated number reports REAL completion, not an estimated timer.
 *
 * setValue drives a timing animation from 0 to TARGET. we record:
 * - how many times the completion callback fires (must be exactly 1)
 * - the value at the moment completion fires (must equal TARGET)
 * - whether any reaction value was observed strictly between 0 and TARGET
 *   before completion (must be true: proves the value actually animated
 *   through intermediate frames rather than jumping and faking completion
 *   on an estimated setTimeout).
 */

const TARGET = 200

export function CSSAnimatedNumberCompletionCase() {
  const animationDriver = useConfiguration().animationDriver!
  const { useAnimatedNumber, useAnimatedNumberReaction } = animationDriver

  const number = useAnimatedNumber(0)
  const hostRef = useRef<any>(null)

  const sawIntermediateRef = useRef(false)
  const samplesRef = useRef(0)

  const [completionCount, setCompletionCount] = useState(0)
  const [valueAtFinish, setValueAtFinish] = useState<number | null>(null)
  const [sawIntermediateAtFinish, setSawIntermediateAtFinish] = useState<boolean | null>(
    null
  )

  useAnimatedNumberReaction({ value: number, hostRef }, (current: number) => {
    samplesRef.current++
    if (current > 0.5 && current < TARGET - 0.5) {
      sawIntermediateRef.current = true
    }
  })

  const run = () => {
    // reset observation state for a clean run
    sawIntermediateRef.current = false
    samplesRef.current = 0
    setValueAtFinish(null)
    setSawIntermediateAtFinish(null)

    number.setValue(TARGET, { type: 'timing', duration: 300 }, () => {
      setCompletionCount((c) => c + 1)
      setValueAtFinish(number.getValue())
      setSawIntermediateAtFinish(sawIntermediateRef.current)
    })
  }

  return (
    <YStack gap="$4" padding="$4">
      <Paragraph fontWeight="bold">CSS Animated Number Completion</Paragraph>

      <Button onPress={run} testID="run-trigger" data-testid="run-trigger">
        Run
      </Button>

      <Paragraph data-testid="completion-count">{completionCount}</Paragraph>
      <Paragraph data-testid="value-at-finish">
        {valueAtFinish === null ? '' : String(valueAtFinish)}
      </Paragraph>
      <Paragraph data-testid="saw-intermediate">
        {sawIntermediateAtFinish === null ? '' : String(sawIntermediateAtFinish)}
      </Paragraph>
    </YStack>
  )
}
