import React from 'react'
import { LogoIcon } from '@tamagui/logo'

import { Square, YStack, isWeb } from 'tamagui'
import { Button } from './Button'

import { useIsIntersecting } from './useOnIntersecting'

export function AnimationsEnterDemo(props: any) {
  const ref = React.useRef<HTMLElement>(null)
  const [key, setKey] = React.useState(0)
  const hasIntersected = useIsIntersecting(ref, { once: true })

  if (isWeb && !hasIntersected) {
    return <YStack ref={ref as any} />
  }

  return (
    <>
      <Square
        key={key}
        opacity="1 enter:0"
        scale="1 enter:1.5"
        y="0 enter:-10px"
        transition="bouncy"
        bg="color9"
        rounded="9"
        elevation="4"
        size={110}
      >
        {props.children ?? <LogoIcon downscale={0.75} />}
      </Square>

      <Button size="medium" mt="4" onPress={() => setKey(Math.random())}>
        Re-mount
      </Button>
    </>
  )
}
