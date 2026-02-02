import { Input, TextArea } from '@tamagui/input'
import { YStack } from 'tamagui'

export function NewInputBasic() {
  return (
    <YStack gap="$4" p="$4">
      <Input data-testid="basic-input" placeholder="Basic input" />
      <Input data-testid="password-input" type="password" placeholder="Password input" />
      <Input data-testid="email-input" type="email" placeholder="Email input" />
      <Input data-testid="number-input" type="number" placeholder="Number input" />
      <Input data-testid="disabled-input" disabled placeholder="Disabled input" />
      <Input data-testid="readonly-input" readOnly value="Read only value" />
      <TextArea data-testid="basic-textarea" placeholder="Basic textarea" rows={3} />
    </YStack>
  )
}
