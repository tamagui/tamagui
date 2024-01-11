import { CheckboxStyledContext, createCheckbox } from '@tamagui/checkbox'
import { Stack, styled } from '@tamagui/core'
import { Check } from '@tamagui/lucide-icons'
import { Label, XStack, YStack } from 'tamagui'

const Frame = styled(Stack, {
  context: CheckboxStyledContext,
  borderWidth: 1,
  borderColor: '$borderColor',
  borderRadius: 5,
  alignItems: 'center',
  justifyContent: 'center',
  variants: {
    checked: {
      true: {
        backgroundColor: 'lightblue',
      },
      false: {
        backgroundColor: 'silver',
      },
    },
  } as const,
  defaultVariants: {
    checked: false,
  },
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
