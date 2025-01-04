import { AnimationsPresenceDemo } from '@tamagui/demos'
import { useState } from 'react'
import { Button, styled } from 'tamagui'

const StyledButton = styled(Button, {
  animation: 'quick',
})

export const Sandbox = () => {
  return <TestButton />
}

function TestButton() {
  const [isDisabled, setIsDisabled] = useState(false)

  return (
    <>
      <Button onPress={() => setIsDisabled(!isDisabled)}>
        {isDisabled ? 'Enable' : 'Disable'}
      </Button>

      <StyledButton onPress={() => setIsDisabled(!isDisabled)} disabled={isDisabled}>
        State: {isDisabled ? 'Disabled' : 'Enabled'}
      </StyledButton>
    </>
  )
}
