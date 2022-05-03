import { Circle, YStack } from 'tamagui'

export const ActiveCircle = ({ isActive, backgroundColor, opacity, ...props }) => {
  return (
    <YStack p="$1" {...props}>
      <YStack
        br="$10"
        borderWidth={1}
        w={22}
        h={22}
        ai="center"
        jc="center"
        borderColor="transparent"
        cursor="pointer"
        {...(!!isActive && {
          borderColor: '$color',
        })}
        {...(!isActive && {
          hoverStyle: {
            borderColor: '$colorMid',
          },
        })}
      >
        <YStack p={2} my={-1}>
          <Circle size={16} opacity={opacity} backgroundColor={backgroundColor} />
        </YStack>
      </YStack>
    </YStack>
  )
}
