import { H2, Paragraph, SubmitButton, Text, Theme, YStack } from '@my/ui'
import { Link } from 'solito/link'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import React, { useEffect } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'
import { z } from 'zod'

const { useParams, useUpdateParams } = createParam<{ email?: string }>()

const SignInSchema = z.object({
  email: formFields.text.email().describe('Email // Enter your email'),
  password: formFields.text.min(6).describe('Password // Enter your password'),
})

export const SignInScreen = () => {
  const supabase = useSupabase()
  const router = useRouter()
  const { params } = useParams()
  const updateParams = useUpdateParams()
  useEffect(() => {
    // remove the persisted email from the url, mostly to not leak user's email in case they share it
    if (params?.email) {
      updateParams({ email: undefined }, { web: { replace: true } })
    }
  }, [params?.email, updateParams])
  const form = useForm<z.infer<typeof SignInSchema>>()

  async function signInWithEmail({ email, password }: z.infer<typeof SignInSchema>) {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
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
    }
  }

  return (
    <FormProvider {...form}>
      <SchemaForm
        form={form}
        schema={SignInSchema}
        defaultValues={{
          email: params?.email || '',
          password: '',
        }}
        onSubmit={signInWithEmail}
        props={{
          password: {
            afterElement: <ForgotPasswordLink />,
            secureTextEntry: true,
          },
        }}
        renderAfter={({ submit }) => {
          return (
            <>
              <Theme inverse>
                <SubmitButton onPress={() => submit()} borderRadius="$10">
                  Sign In
                </SubmitButton>
              </Theme>
              <SignUpLink />
              {/* <YStack>
            <Button disabled={loading} onPress={() => signInWithProvider('github')}>
              GitHub Login
            </Button>
          </YStack> */}
            </>
          )
        }}
      >
        {(fields) => (
          <>
            <YStack gap="$3" mb="$4">
              <H2 $sm={{ size: '$8' }}>Welcome Back</H2>
              <Paragraph theme="alt1">Sign in to your account</Paragraph>
            </YStack>
            {Object.values(fields)}
          </>
        )}
      </SchemaForm>
    </FormProvider>
  )
}

const SignUpLink = () => {
  const email = useWatch<z.infer<typeof SignInSchema>>({ name: 'email' })
  return (
    <Link href={`/sign-up?${new URLSearchParams(email ? { email } : undefined).toString()}`}>
      <Paragraph textAlign="center" theme="alt1">
        Don&apos;t have an account? <Text textDecorationLine="underline">Sign up</Text>
      </Paragraph>
    </Link>
  )
}

const ForgotPasswordLink = () => {
  const email = useWatch<z.infer<typeof SignInSchema>>({ name: 'email' })

  return (
    <Link href={`/reset-password?${new URLSearchParams(email ? { email } : undefined)}`}>
      <Paragraph mt="$1" theme="alt2" textDecorationLine="underline">
        Forgot your password?
      </Paragraph>
    </Link>
  )
}
