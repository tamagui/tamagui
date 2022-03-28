import { Circle, YStack } from 'tamagui'

export const ActiveCircle = ({ isActive, ...props }) => {
  return (
    <YStack
      br="$10"
      borderWidth={2}
      borderColor="transparent"
      my={-1}
      {...(!!isActive && {
        borderColor: '$color',
      })}
      {...(!isActive && {
        hoverStyle: {
          borderColor: '$borderColor',
        },
      })}
    >
      {/* @ts-ignore */}
      <Circle size={20} backgroundColor="$background" {...props} />
    </YStack>
  )
}
