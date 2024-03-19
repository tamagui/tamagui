import { CheckboxStyledContext, createCheckbox } from '@tamagui/checkbox'
import { Stack, styled } from '@tamagui/core'
import { Check } from '@tamagui/lucide-icons'
import { Label, XStack, YStack } from 'tamagui'

const Frame = styled(Stack, {
  borderWidth: 1,
  borderColor: '$borderColor',
  borderRadius: 5,
  alignItems: 'center',
  justifyContent: 'center',
  variants: {
    checked: {
      indeterminate: {},
      true: {
        backgroundColor: '$color5',
      },
      false: {
        backgroundColor: '$color3',
      },
    },
  } as const,

  defaultVariants: {
    checked: false,
  },
})

const Indicator = styled(Stack, {})

export const Checkbox = createCheckbox({
  Frame,
  Indicator,
})

export function CheckboxUnstyledDemo() {
  return (
    <YStack width={200} alignItems="center" gap="$3">
      <XStack gap="$3" alignItems="center">
        <Checkbox defaultChecked id="unstyled">
          <Checkbox.Indicator>
            <Check />
          </Checkbox.Indicator>
        </Checkbox>
        <Label htmlFor="unstyled">Unstyled</Label>
      </XStack>
    </YStack>
  )
}
