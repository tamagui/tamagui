import type { CircleProps } from 'tamagui'
import { Circle } from 'tamagui'
import { YStack } from 'tamagui'

import { Checkerboard } from './Checkerboard'

export const CircleColor = (propsIn: CircleProps) => {
  const { bg, ...props } = propsIn
  return (
    <Circle borderWidth={1} borderColor="border-color" overflow="hidden" {...props}>
      <Checkerboard />
      <YStack position="absolute" inset={0} bg={bg} />
      <YStack
        z={100}
        position="absolute"
        inset={0}
        rounded={100}
        style={{
          boxShadow: `inset 0 0 8px rgba(0,0,0,0.05)`,
        }}
      />
    </Circle>
  )
}
