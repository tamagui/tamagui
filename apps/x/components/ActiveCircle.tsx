import type { CircleProps } from 'tamagui'
import { Circle, YStack } from 'tamagui'

export const ActiveCircle = (props: CircleProps & { isActive?: boolean }) => {
  const { isActive, backgroundColor, opacity, ...rest } = props

  return (
    <YStack
      ai="center"
      jc="center"
      br="$10"
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
        br="$10"
        w={22}
        h={22}
        ai="center"
        jc="center"
        borderColor="transparent"
        cursor="pointer"
      >
        <Circle size={16} opacity={opacity} backgroundColor={backgroundColor} />
      </YStack>
    </YStack>
  )
}
