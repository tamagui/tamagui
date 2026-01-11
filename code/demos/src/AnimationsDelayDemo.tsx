import React from 'react'
import { AnimatePresence, Button, Square, XStack, YStack, isWeb } from 'tamagui'

import { useIsIntersecting } from './useOnIntersecting'

const colors = ['$red10', '$green10', '$blue10', '$purple10'] as const

export function AnimationsDelayDemo() {
  const ref = React.useRef<HTMLElement>(null)
  const hasIntersected = useIsIntersecting(ref, { once: true })
  const [show, setShow] = React.useState(true)

  if (isWeb && !hasIntersected) {
    return <YStack ref={ref} height={150} />
  }

  return (
    <YStack gap="$4" items="center">
      <XStack gap="$3" height={100} items="center" justify="center">
        <AnimatePresence>
          {show &&
            colors.map((color, i) => (
              <Square
                key={color}
                transition={['200ms', { delay: i * 100 }]}
                enterStyle={{
                  opacity: 0,
                  scale: 0.5,
                  y: 20,
                }}
                exitStyle={{
                  opacity: 0,
                  scale: 0,
                  y: 20,
                }}
                size={60}
                bg={color}
                rounded="$4"
              />
            ))}
        </AnimatePresence>
      </XStack>

      <Button size="$3" onPress={() => setShow(!show)}>
        {show ? 'Hide' : 'Show'}
      </Button>
    </YStack>
  )
}
