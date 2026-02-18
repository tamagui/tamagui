import { Input } from '@tamagui/input'
import { useState } from 'react'
import { styled, Button, YStack } from 'tamagui'

const StyledInput = styled(Input, {
  borderColor: '$blue8',
  borderWidth: 2,
})

export function InputAutoFocusStyledCase() {
  const [view, setView] = useState<'plain' | 'styled' | null>(null)

  return (
    <YStack padding="$4" gap="$4">
      {view === null && (
        <>
          <Button data-testid="show-plain" onPress={() => setView('plain')}>
            Show Plain
          </Button>
          <Button data-testid="show-styled" onPress={() => setView('styled')}>
            Show Styled
          </Button>
        </>
      )}

      {view === 'plain' && (
        <Input data-testid="plain-autofocus" placeholder="Plain autoFocus" autoFocus />
      )}

      {view === 'styled' && (
        <StyledInput
          data-testid="styled-autofocus"
          placeholder="Styled autoFocus"
          autoFocus
        />
      )}
    </YStack>
  )
}
