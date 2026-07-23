import { Button, Form, H2, Text, YStack } from 'tamagui'
import { useForm } from 'react-hook-form'
import * as React from 'react'
import {
  FixtureField,
  FixtureFieldError,
  FixtureFieldInput,
  FixtureFieldLabel,
} from './FieldFixtureParts'

type Values = {
  email: string
}

export function FieldReactHookFormBridgeCase() {
  const [status, setStatus] = React.useState('idle')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>()

  const formErrors = errors.email?.message
    ? { email: String(errors.email.message) }
    : undefined

  return (
    <YStack p="$4" width="100%" maxW={480} self="center">
      <Form<Values>
        gap="$4"
        errors={formErrors}
        onSubmit={() => {
          void handleSubmit(() => setStatus('submitted'))()
        }}
      >
        <H2>React Hook Form bridge</H2>

        <FixtureField name="email">
          <FixtureFieldLabel>Email</FixtureFieldLabel>
          <FixtureFieldInput
            data-testid="rhf-email"
            testID="rhf-email"
            type="email"
            {...register('email', {
              required: 'Email is required',
            })}
          />
          <FixtureFieldError />
        </FixtureField>

        <Form.Trigger asChild>
          <Button data-testid="rhf-submit" testID="rhf-submit">
            Submit
          </Button>
        </Form.Trigger>

        <Text data-testid="rhf-status">{status}</Text>
      </Form>
    </YStack>
  )
}
