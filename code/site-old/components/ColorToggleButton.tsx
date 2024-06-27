import { useTint } from '@tamagui/logo'
import type { ButtonProps } from 'tamagui'
import { Button, Circle, TooltipSimple } from 'tamagui'

export const ColorToggleButton = (props: ButtonProps) => {
  const { tint, setNextTint } = useTint()
  return (
    <TooltipSimple groupId="header-actions-color" label="Next theme">
      <Button size="$3" onPress={setNextTint} {...props}>
        <Circle bw={1} bc="var(--color9)" m={2} size={12} backgroundColor={tint as any} />
      </Button>
    </TooltipSimple>
  )
}
