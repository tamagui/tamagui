import { Button, type ButtonProps, Text, YStack } from '@tamagui/ui'
import { TakeoutIcon } from '../icons/TakeoutIcon'

export const TakeoutButton = (props: ButtonProps) => {
  return (
    <Button
      // animation="bouncy"
      bc="$color6"
      size="$3"
      br="$10"
      fontFamily="$silkscreen"
      fontSize={12}
      brw={0.5}
      hoverStyle={{
        bc: '$color8',
        bg: '$color5',
      }}
      {...props}
    >
      Takeout
      <YStack y={-1} dsp="inline-flex">
        <TakeoutIcon scale={0.75} />
      </YStack>
      <Text y={-0.5} ff="$mono" fontSize="$4" color="$color10" $sm={{ dsp: 'none' }}>
        starter
      </Text>
    </Button>
  )
}
