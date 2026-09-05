import type { CircleProps } from 'tamagui'
import { Circle, YStack } from 'tamagui'

export const ActiveCircle = (props: CircleProps & { isActive?: boolean }) => {
  const { isActive, bg, opacity, ...rest } = props

  return (
    <YStack
      items="center"
      justify="center"
      rounded="10"
      borderWidth={1}
      mx="1"
      borderColor={isActive ? 'color' : 'transparent hover:color5'}
      {...rest}
    >
      <YStack
        rounded="10"
        width={22}
        height={22}
        items="center"
        justify="center"
        borderColor="transparent"
        cursor="pointer"
      >
        <Circle size={16} opacity={opacity} bg={bg} />
      </YStack>
    </YStack>
  )
}
