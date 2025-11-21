import type { CircleProps } from 'tamagui'
import { Circle, YStack } from 'tamagui'

export const ActiveCircle = (props: CircleProps & { isActive?: boolean }) => {
  const { isActive, bg, opacity, ...rest } = props

  return (
    <YStack
      items="center"
      justify="center"
      rounded="$10"
      borderColor="transparent"
      borderWidth={1}
      mx="$1"
      {...(isActive && {
        borderColor: '$color',
      })}
      {...(!isActive && {
        hoverStyle: {
          borderColor: '$color5',
        },
      })}
      {...rest}
    >
      <YStack
        rounded="$10"
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
