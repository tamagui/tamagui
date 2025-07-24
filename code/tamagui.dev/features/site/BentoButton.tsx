import { Button, type ButtonProps, YStack } from '@tamagui/ui'
import { BentoIcon } from '../icons/BentoIcon'

export const BentoButton = (props: ButtonProps) => {
  return (
    <Button.Frame
      blw={0.5}
      bc="$color6"
      size="$3"
      br="$10"
      hoverStyle={{
        bc: '$color7',
        bg: '$color5',
      }}
      {...props}
    >
      <Button.Text ff="$silkscreen" fontSize={12}>
        Bento
      </Button.Text>
      <YStack dsp="inline-flex" mx="$2">
        <BentoIcon scale={0.75} />
      </YStack>
      <Button.Text
        ff="$mono"
        y={-0.5}
        fontSize="$4"
        color="$color10"
        $sm={{ dsp: 'none' }}
      >
        more ui
      </Button.Text>
    </Button.Frame>
  )
}
