import { setNextTintFamily } from '@tamagui/logo'
import { useTint } from '@tamagui/logo'
import { Button, ButtonProps, Text, TooltipSimple } from 'tamagui'

export const SeasonToggleButton = (props: ButtonProps) => {
  const { name } = useTint()
  return (
    <TooltipSimple groupId="header-actions-season" label={`Mode: ${name}`}>
      <Button size="$3" onPress={setNextTintFamily} {...props} aria-label="Toggle theme">
        <Text rotate="-35deg" als="center" scale={2} x={4} y={7}>
          {['🐥', '🎅🏻'][name === 'tamagui' ? 0 : 1]}
        </Text>
      </Button>
    </TooltipSimple>
  )
}
