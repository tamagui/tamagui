import { Button, type ButtonProps, YStack } from 'tamagui'
import { TakeoutIcon } from '../icons/TakeoutIcon'

export const TakeoutButton = (props: ButtonProps) => {
  return (
    <Button.Frame
      borderColor="$color4"
      size="$3"
      rounded="$10"
      borderRightWidth={0.5}
      bg="$background02"
      hoverStyle={{
        borderColor: '$color5',
        bg: '$color4',
      }}
      {...props}
    >
      <Button.Text fontFamily="$silkscreen" fontSize={12}>
        Takeout
      </Button.Text>
      <YStack y={-1} display="inline-flex" mx="$1.5">
        <TakeoutIcon scale={0.75} />
      </YStack>
    </Button.Frame>
  )
}
