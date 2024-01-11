import { CheckboxStyledContext, createCheckbox } from '@tamagui/checkbox'
import { Stack, styled } from '@tamagui/core'
import { Check } from '@tamagui/lucide-icons'
import { Label, XStack, YStack } from 'tamagui'

const Frame = styled(Stack, {
  context: CheckboxStyledContext,

  variants: {
    checked: {
      true: {
        backgroundColor: 'yellow',
      },
      false: {
        backgroundColor: 'green',
      },
    },
  } as const,
})

const Indicator = styled(Stack, {
  context: CheckboxStyledContext,
})

// TODO: remove ts-ignores
export const Checkbox = createCheckbox({
  // @ts-ignore
  Frame,
  // @ts-ignore
  Indicator,
})

export function CheckboxUnstyledDemo() {
  return (
    <YStack width={200} alignItems="center" space="$3">
      <XStack space="$3" alignItems="center">
        <Label htmlFor="unstyled">Unstyled</Label>
        <Checkbox defaultChecked id="unstyled">
          <Checkbox.Indicator>
            <Check />
          </Checkbox.Indicator>
        </Checkbox>
      </XStack>
    </YStack>
  )
}
