import { FocusScope } from '@tamagui/focus-scope'
import React from 'react'
import { Button, Input, YStack } from 'tamagui'

export function FocusScopeNoFocusCase() {
  const [noFocus, setNoFocus] = React.useState(true)

  return (
    <YStack padding="$4" gap="$4" maxWidth={400}>
      <Button data-testid="toggle-no-focus" onPress={() => setNoFocus((x) => !x)}>
        {noFocus ? 'noFocus: on' : 'noFocus: off'}
      </Button>

      <Input data-testid="outside-input" placeholder="Outside input" />

      <FocusScope noFocus={noFocus}>
        <YStack gap="$3" data-testid="scope-content">
          <Input data-testid="inside-input" placeholder="Inside input" />
          <Button data-testid="inside-button">Inside button</Button>
        </YStack>
      </FocusScope>

      <Button data-testid="outside-button">Outside button</Button>
    </YStack>
  )
}
