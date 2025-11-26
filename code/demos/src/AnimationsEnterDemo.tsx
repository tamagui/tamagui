import React from 'react'
import { LogoIcon } from '@tamagui/logo'

import { Button, Square, YStack, isWeb } from 'tamagui'

import { useIsIntersecting } from './useOnIntersecting'

export function AnimationsEnterDemo(props: any) {
  const ref = React.useRef<HTMLElement>(null)
  const [key, setKey] = React.useState(0)
  const hasIntersected = useIsIntersecting(ref, { once: true })

  if (isWeb && !hasIntersected) {
    return <YStack ref={ref} />
  }

  return (
    <>
      <Square
        key={key}
        enterStyle={{
          scale: 1.5,
          y: -10,
          opacity: 0,
        }}
        animation="bouncy"
        elevation="$4"
        size={110}
        opacity={1}
        scale={1}
        y={0}
        bg="$pink10"
        rounded="$9"
      >
        {props.children ?? <LogoIcon downscale={0.75} />}
      </Square>

      <Button size="$3" mt="$4" onPress={() => setKey(Math.random())}>
        Re-mount
      </Button>
    </>
  )
}
