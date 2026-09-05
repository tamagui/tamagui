import React from 'react'
import { AnimatePresence, Button, Square, XStack, YStack, isWeb } from 'tamagui'

import { useIsIntersecting } from './useOnIntersecting'

const colors = ['color8', 'color9', 'color10', 'color11'] as const

export function AnimationsDelayDemo() {
  const ref = React.useRef<HTMLElement>(null)
  const hasIntersected = useIsIntersecting(ref, { once: true })
  const [show, setShow] = React.useState(true)

  if (isWeb && !hasIntersected) {
    return <YStack ref={ref as any} height={150} />
  }

  return (
    <YStack gap="4" items="center">
      <XStack gap="3" height={100} items="center" justify="center">
        <AnimatePresence>
          {show &&
            colors.map((color, i) => (
              <Square
                key={color}
                transition={{ duration: 200, delay: i * 100 }}
                opacity="enter:0 exit:0"
                scale="enter:0.5 exit:0"
                y="enter:20px exit:20px"
                bg={color}
                rounded="4"
                size={60}
              />
            ))}
        </AnimatePresence>
      </XStack>

      <Button size="3" onPress={() => setShow(!show)}>
        {show ? 'Hide' : 'Show'}
      </Button>
    </YStack>
  )
}
