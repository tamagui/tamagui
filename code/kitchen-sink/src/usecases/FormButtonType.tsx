import { useState } from 'react'
import { Button, Form, Input, Text, YStack } from 'tamagui'

export function FormButtonType() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [buttonClicked, setButtonClicked] = useState(false)

  return (
    <YStack gap="$4" padding="$4">
      <Form
        onSubmit={() => setFormSubmitted(true)}
        gap="$2"
      >
        <Input
          id="test-input"
          placeholder="Press Enter here"
        />

        {/* This button should NOT submit the form when Enter is pressed in Input */}
        <Button
          id="regular-button"
          onPress={() => setButtonClicked(true)}
        >
          Regular Button (should not submit)
        </Button>

        {/* This Form.Trigger SHOULD submit the form */}
        <Form.Trigger asChild>
          <Button id="submit-button">Submit Button</Button>
        </Form.Trigger>
      </Form>

      <Text id="form-status">
        Form submitted: {formSubmitted ? 'yes' : 'no'}
      </Text>
      <Text id="button-status">
        Button clicked: {buttonClicked ? 'yes' : 'no'}
      </Text>
    </YStack>
  )
}
