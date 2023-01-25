import { TamaguiLogo, setNextTintFamily } from '@tamagui/logo'
import { useTint } from '@tamagui/logo'
import { Button, ButtonProps, Image, Text, TooltipSimple } from 'tamagui'

export const SeasonToggleButton = (props: ButtonProps) => {
  const { name } = useTint()
  return (
    <TooltipSimple groupId="header-actions-season" label={`Mode: ${name}`}>
      <Button
        size="$3"
        w={38}
        onPress={setNextTintFamily}
        {...props}
        aria-label="Toggle theme"
      >
        <Text>{[<TamaguiLogo downscale={2.5} />, '🎅🏻'][name === 'tamagui' ? 0 : 1]}</Text>
      </Button>
    </TooltipSimple>
  )
}
