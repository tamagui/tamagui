import { Button, type ButtonProps, Text, YStack } from 'tamagui'
import { TakeoutIcon } from '../icons/TakeoutIcon'

export const TakeoutButton = (props: ButtonProps) => {
  return (
    <Button
      borderColor="$color6"
      size="$3"
      rounded="$10"
      fontFamily="$silkscreen"
      fontSize={12}
      borderWidth={0.5}
      hoverStyle={{
        borderColor: '$color8',
        bg: '$color5',
      }}
      {...props}
    >
      Takeout
      <YStack y={-1} display="inline-flex">
        <TakeoutIcon scale={0.75} />
      </YStack>
      <Text y={-0.5} fontFamily="$mono" fontSize="$4" color="$color10" $sm={{ display: 'none' }}>
        starter
      </Text>
    </Button>
  )
}
