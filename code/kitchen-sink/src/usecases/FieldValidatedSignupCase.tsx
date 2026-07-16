import { Button, Field, Form, H2, Portal, Text, XStack, YStack } from 'tamagui'
import * as React from 'react'
import {
  FixtureField,
  FixtureFieldDescription,
  FixtureFieldError,
  FixtureFieldInput,
  FixtureFieldLabel,
} from './FieldFixtureParts'

type SignupValues = {
  firstName: string
  lastName: string
  email: string
  username: string
}

export function FieldValidatedSignupCase() {
  const [serverErrors, setServerErrors] = React.useState<
    Record<string, string | string[]>
  >({})
  const [status, setStatus] = React.useState('idle')

  return (
    <YStack p="$4" width="100%" maxW={560} self="center">
      <Form<SignupValues>
        gap="$5"
        errors={serverErrors}
        onSubmit={(values, details) => {
          if (values.email === 'used@example.com') {
            setStatus('server error')
            setTimeout(() => {
              setServerErrors({
                email: 'That email is already registered',
              })
            }, 25)
            return
          }

          setStatus(`submitted: ${details.reason}`)
        }}
      >
        <H2>Create an account</H2>

        <XStack gap="$4" flexWrap="wrap">
          <FixtureField
            name="firstName"
            flex={1}
            minW={220}
            data-testid="signup-first-name-field"
          >
            <FixtureFieldLabel>First name</FixtureFieldLabel>
            <FixtureFieldInput
              data-testid="signup-first-name"
              testID="signup-first-name"
              required
            />
            <FixtureFieldDescription>Shown on your profile</FixtureFieldDescription>
            <Portal>
              <FixtureFieldDescription
                data-testid="signup-first-name-portaled-description"
                display="none"
              >
                This message is rendered through a portal.
              </FixtureFieldDescription>
            </Portal>
            <FixtureFieldError />
          </FixtureField>

          <FixtureField name="lastName" flex={1} minW={220}>
            <FixtureFieldLabel>Last name</FixtureFieldLabel>
            <FixtureFieldInput
              data-testid="signup-last-name"
              testID="signup-last-name"
              required
            />
            <FixtureFieldError />
          </FixtureField>
        </XStack>

        <FixtureField name="email">
          <FixtureFieldLabel>Email</FixtureFieldLabel>
          <FixtureFieldInput
            data-testid="signup-email"
            testID="signup-email"
            type="email"
            required
          />
          <FixtureFieldDescription>
            We only use this for account access.
          </FixtureFieldDescription>
          <FixtureFieldError />
        </FixtureField>

        <FixtureField
          name="username"
          validationMode="onBlur"
          validate={(value) => {
            const username = String(value ?? '')
            if (username.length < 3) {
              return 'Username must be at least 3 characters'
            }
            if (username === 'reserved') {
              return new Promise<string>((resolve) => {
                setTimeout(() => resolve('Username is reserved'), 500)
              })
            }
            return null
          }}
        >
          <FixtureFieldLabel>Username</FixtureFieldLabel>
          <FixtureFieldInput
            data-testid="signup-username"
            testID="signup-username"
            required
          />
          <FixtureFieldDescription>
            Checked asynchronously when you leave the field.
          </FixtureFieldDescription>
          <FixtureFieldError />
        </FixtureField>

        <Form.Trigger asChild>
          <Button data-testid="signup-submit" testID="signup-submit" theme="accent">
            Create account
          </Button>
        </Form.Trigger>

        <Text data-testid="signup-status" testID="signup-status">
          {status}
        </Text>
      </Form>
    </YStack>
  )
}
