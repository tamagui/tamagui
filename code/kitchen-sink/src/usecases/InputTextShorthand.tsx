import { Input, TextArea } from '@tamagui/input'
import { YStack } from 'tamagui'

// regression: the `text` shorthand (text -> textAlign) must be accepted on Input
// and TextArea, not just the `textAlign` longhand. before the GetBaseStyles fix,
// styled(View, …) dropped text-only style props (and their shorthands) from the
// type even though isInput makes them valid at runtime.
export function InputTextShorthand() {
  return (
    <YStack gap="$4" p="$4">
      <Input data-testid="input-text-shorthand" text="center" defaultValue="centered" />
      <Input
        data-testid="input-textalign-longhand"
        textAlign="right"
        defaultValue="right"
      />
      <TextArea
        data-testid="textarea-text-shorthand"
        text="center"
        defaultValue="centered"
        rows={2}
      />
    </YStack>
  )
}
