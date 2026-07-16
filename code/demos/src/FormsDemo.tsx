import * as React from 'react'
import { Button, Field, Form, Paragraph, Spinner, YStack } from 'tamagui'
import { FieldInput } from './FieldDemo'

export function FormsDemo() {
  const [status, setStatus] = React.useState<'idle' | 'submitting'>('idle')

  React.useEffect(() => {
    if (status !== 'submitting') {
      return
    }
    const timer = setTimeout(() => setStatus('idle'), 1200)
    return () => clearTimeout(timer)
  }, [status])

  return (
    <Form
      width={350}
      maxW="90%"
      gap="$4"
      onSubmit={() => setStatus('submitting')}
      borderWidth={1}
      rounded="$4"
      bg="$color2"
      borderColor="$borderColor"
      p="$6"
    >
      <Field name="email" gap="$2">
        <Field.Label fontWeight="600">Email</Field.Label>
        <FieldInput type="email" placeholder="ada@example.com" required />
        <Field.Description color="$color10" fontSize="$2">
          Form collects this value by field name.
        </Field.Description>
        <Field.Error color="$red10" fontSize="$2" />
      </Field>

      <Form.Trigger asChild disabled={status !== 'idle'}>
        <Button bg="$color12" color="$color1" hoverStyle={{ bg: '$color11' }}>
          Submit
        </Button>
      </Form.Trigger>

      <YStack height={24} items="center" justify="center">
        {status === 'submitting' ? (
          <Spinner size="small" />
        ) : (
          <Paragraph color="$color10" size="$2">
            Ready
          </Paragraph>
        )}
      </YStack>
    </Form>
  )
}
