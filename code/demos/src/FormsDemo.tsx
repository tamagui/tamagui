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
      rounded="$7"
      bg="$color2"
      borderColor="$borderColor"
      p="$6"
      boxShadow="0 2px 3px rgba(0, 0, 0, 0.06), 0 14px 30px rgba(0, 0, 0, 0.10), 0 36px 72px rgba(0, 0, 0, 0.12)"
    >
      <Field name="email" gap="$2">
        <Field.Label color="$color11" fontWeight="500">
          Email
        </Field.Label>
        <FieldInput type="email" placeholder="ada@example.com" required />
        <Field.Description color="$color9" fontSize="$2">
          Form collects this value by field name.
        </Field.Description>
        <Field.Error color="$red10" fontSize="$2" />
      </Field>

      <Form.Trigger asChild disabled={status !== 'idle'}>
        <Button
          self="flex-end"
          height={40}
          px="$5"
          rounded="$5"
          bg="$color12"
          color="$color1"
          fontSize="$2"
          fontWeight="500"
          hoverStyle={{ bg: '$color11' }}
        >
          Submit
        </Button>
      </Form.Trigger>

      <YStack height={24} items="center" justify="center">
        {status === 'submitting' ? (
          <Spinner size="small" />
        ) : (
          <Paragraph color="$color9" size="$2">
            Ready
          </Paragraph>
        )}
      </YStack>
    </Form>
  )
}
