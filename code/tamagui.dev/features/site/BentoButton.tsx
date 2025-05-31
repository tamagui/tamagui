import { Button, type ButtonProps, Text, YStack } from '@tamagui/ui'
import { BentoIcon } from '../icons/BentoIcon'

export const BentoButton = (props: ButtonProps) => {
  return (
    <Button
      // animation="bouncy"
      blw={0.5}
      bc="$color6"
      size="$3"
      br="$10"
      fontFamily="$silkscreen"
      fontSize={12}
      hoverStyle={{
        bc: '$color7',
        bg: '$color5',
      }}
      {...props}
    >
      Bento
      <YStack dsp="inline-flex" mx={4}>
        <BentoIcon scale={0.75} />
      </YStack>
      <Text ff="$mono" y={-0.5} fontSize="$4" color="$color10" $sm={{ dsp: 'none' }}>
        more ui
      </Text>
    </Button>
  )
}
