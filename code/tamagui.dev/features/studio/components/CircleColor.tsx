import type { CircleProps } from 'tamagui'
import { Circle, useProps } from 'tamagui'
import { YStack } from 'tamagui'

import { Checkerboard } from './Checkerboard'

export const CircleColor = (propsIn: CircleProps) => {
  const { backgroundColor, ...props } = useProps(propsIn)
  return (
    <Circle bw={1} bc="$borderColor" ov="hidden" {...props}>
      <Checkerboard />
      <YStack fullscreen bg={backgroundColor} />
      <YStack
        zi={100}
        fullscreen
        br={100}
        style={{
          // @ts-ignore
          boxShadow: `inset 0 0 8px rgba(0,0,0,0.05)`,
        }}
      />
    </Circle>
  )
}
