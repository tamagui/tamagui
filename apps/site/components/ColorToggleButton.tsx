import { Button, ButtonProps, Circle, TooltipSimple } from 'tamagui'

import { useTint } from './useTint'

export const ColorToggleButton = (props: ButtonProps) => {
  const { tint, setNextTint } = useTint()
  return (
    <TooltipSimple groupId="header-actions-color" label="Change color">
      <Button size="$3" onPress={setNextTint} {...props} aria-label="Toggle color">
        <Circle bw={1} boc="#fff" m={2} size={12} backgroundColor={tint} />
      </Button>
    </TooltipSimple>
  )
}
