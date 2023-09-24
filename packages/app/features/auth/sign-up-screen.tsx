import {
  Button,
  FormWrapper,
  H2,
  Paragraph,
  SubmitButton,
  Text,
  Theme,
  YStack,
} from '@my/ui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import React, { useEffect } from 'react'
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import { createParam } from 'solito'
import { Link } from 'solito/link'
import { useRouter } from 'solito/router'
import { z } from 'zod'

const { useParams, useUpdateParams } = createParam<{ email?: string }>()

const SignUpSchema = z.object({
  email: formFields.text.email().describe('Email // your@email.acme'),
  password: formFields.text.min(6).describe('Password // Choose a password'),
  firstName: formFields.text.describe('First Name // John'),
  lastName: formFields.text.describe('Last Name // Doe'),
  username: formFields.text.describe('Username // johndoe'),
})

// change it to true if you're doing email confirms
const usesEmailConfirm = false

export const SignUpScreen = () => {
  const supabase = useSupabase()
  const router = useRouter()
  const updateParams = useUpdateParams()
  const { params } = useParams()

  useEffect(() => {
    if (params?.email) {
      updateParams({ email: undefined }, { web: { replace: true } })
    }
  }, [params?.email, updateParams])

  const form = useForm<z.infer<typeof SignUpSchema>>()

  async function signUpWithEmail({
    email,
    password,
    firstName,
    lastName,
    username,
  }: z.infer<typeof SignUpSchema>) {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // To take user's name other info
        data: {
          first_name: firstName, // coming from state
          last_name: lastName,
          username,
        },
      },
    })

    if (error) {
      const errorMessage = error?.message.toLowerCase()
      if (errorMessage.includes('email')) {
        form.setError('email', { type: 'custom', message: errorMessage })
      } else if (errorMessage.includes('password')) {
        form.setError('password', { type: 'custom', message: errorMessage })
      } else {
        form.setError('password', { type: 'custom', message: errorMessage })
      }
    } else {
      router.replace('/')
      // do this instead if you're doing email confirms:
      // setShowSuccess(true)
    }
  }

  return (
    <FormProvider {...form}>
      {form.formState.isSubmitSuccessful && usesEmailConfirm ? (
        <CheckYourEmail />
      ) : (
        <SchemaForm
          form={form}
          schema={SignUpSchema}
          defaultValues={{
            email: params?.email || '',
            password: '',
          }}
          props={{
            password: {
              secureTextEntry: true,
            },
          }}
          onSubmit={signUpWithEmail}
          renderAfter={({ submit }) => (
            <>
              <Theme inverse>
                <SubmitButton onPress={() => submit()} borderRadius="$10">
                  Sign Up
                </SubmitButton>
              </Theme>
              <SignInLink />
              {/* <YStack>
            <Button disabled={loading} onPress={() => signInWithProvider('github')}>
              GitHub Login
            </Button>
          </YStack> */}
            </>
          )}
        >
          {(fields) => (
            <>
              <YStack gap="$3" mb="$4">
                <H2 $sm={{ size: '$8' }}>Get Started</H2>
                <Paragraph theme="alt2">Create a new account</Paragraph>
              </YStack>
              {Object.values(fields)}
            </>
          )}
        </SchemaForm>
      )}
    </FormProvider>
  )
}

const SignInLink = () => {
  const email = useWatch<z.infer<typeof SignUpSchema>>({ name: 'email' })

  return (
    <Link
      href={`/sign-in?${new URLSearchParams(
        email ? { email } : undefined
      ).toString()}`}
    >
      <Paragraph textAlign="center" theme="alt1">
        Already signed up? <Text textDecorationLine="underline">Sign in</Text>
      </Paragraph>
    </Link>
  )
}

const CheckYourEmail = () => {
  const email = useWatch<z.infer<typeof SignUpSchema>>({ name: 'email' })
  const { reset } = useFormContext()

  return (
    <FormWrapper>
      <FormWrapper.Body>
        <YStack gap="$3">
          <H2>Check Your Email</H2>
          <Paragraph theme="alt1">
            We&apos;ve sent you a confirmation link. Please check your email (
            {email}) and confirm it.
          </Paragraph>
        </YStack>
      </FormWrapper.Body>
      <FormWrapper.Footer>
        <Button
          themeInverse
          icon={ChevronLeft}
          borderRadius="$10"
          onPress={() => reset()}
        >
          Back
        </Button>
      </FormWrapper.Footer>
    </FormWrapper>
  )
}
