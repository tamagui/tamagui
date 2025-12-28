import { Button, type ButtonProps, Text, YStack } from 'tamagui'
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
        borderColor: '$color6',
        bg: '$color5',
      }}
      {...props}
    >
      <Button.Text fontFamily="$silkscreen" fontSize={12}>
        Takeout
      </Button.Text>
      <YStack y={-1} display="inline-flex" mx="$1.5">
        <TakeoutIcon scale={0.75} />
      </YStack>
      <Button.Text
        y={-0.5}
        fontFamily="$mono"
        fontSize="$4"
        color="$color10"
        $sm={{ display: 'none' }}
      >
        starter
      </Button.Text>
    </Button.Frame>
  )
}
