import { Circle, YStack } from 'tamagui'

export const ActiveCircle = ({ isActive, backgroundColor, opacity, ...props }: any) => {
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
          borderColor: '$colorMid',
        },
      })}
      {...props}
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
