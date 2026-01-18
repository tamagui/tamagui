import { useState } from 'react'
import { Input } from '@tamagui/input'
import { Text, YStack } from 'tamagui'

export function NewInputEvents() {
  const [value, setValue] = useState('')
  const [changeCount, setChangeCount] = useState(0)
  const [submitCount, setSubmitCount] = useState(0)

  return (
    <YStack gap="$4" p="$4">
      <Input
        data-testid="event-input"
        placeholder="Type here..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setChangeCount((c) => c + 1)
        }}
        onSubmitEditing={() => {
          setSubmitCount((c) => c + 1)
        }}
      />
      <Text data-testid="value-display">Value: {value}</Text>
      <Text data-testid="change-count">Changes: {changeCount}</Text>
      <Text data-testid="submit-count">Submits: {submitCount}</Text>
    </YStack>
  )
}
