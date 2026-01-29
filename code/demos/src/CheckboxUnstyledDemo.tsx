import { createCheckbox } from '@tamagui/checkbox'
import { View, styled } from '@tamagui/core'
import { Check } from '@tamagui/lucide-icons'
import { Label, XStack, YStack } from 'tamagui'

const Frame = styled(View, {
  borderWidth: 1,
  borderColor: '$borderColor',
  rounded: 5,
  items: 'center',
  justify: 'center',
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

const Indicator = styled(View, {})

export const Checkbox = createCheckbox({
  Frame,
  Indicator,
})

export function CheckboxUnstyledDemo() {
  return (
    <YStack width={200} items="center" gap="$3">
      <XStack gap="$3" items="center">
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
