import { useState } from 'react'
import { Button, Form, Input, Text, YStack } from 'tamagui'

export function FormButtonTypeCase() {
  const [submitted, setSubmitted] = useState(false)
  const [buttonClicked, setButtonClicked] = useState(false)

  return (
    <YStack gap="$4" padding="$4">
      <Form
        onSubmit={() => {
          setSubmitted(true)
        }}
      >
        <YStack gap="$2">
          <Input data-testid="form-input" placeholder="Press enter to submit" />

          <Button data-testid="regular-button" onPress={() => setButtonClicked(true)}>
            Regular Button (type=button)
          </Button>

          <Form.Trigger data-testid="submit-button">Submit Button (type=submit)</Form.Trigger>
        </YStack>
      </Form>

      <Text data-testid="submit-status">{submitted ? 'submitted' : 'not-submitted'}</Text>
      <Text data-testid="button-status">
        {buttonClicked ? 'button-clicked' : 'button-not-clicked'}
      </Text>
    </YStack>
  )
}
