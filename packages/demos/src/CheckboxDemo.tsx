import { Check as CheckIcon } from '@tamagui/lucide-icons'
import { Checkbox, Label, XStack } from 'tamagui'

export function CheckboxDemo() {
  return (
    <XStack ai="center" space="$4">
      <Checkbox
        id="terms-and-conditions"
        width="$2"
        height="$2"
        ai="center"
        jc="center"
        backgroundColor="$green5"
        borderRadius="$2"
      >
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox>

      <Label htmlFor="terms-and-conditions">Accept terms and conditions</Label>
    </XStack>
  )
}
