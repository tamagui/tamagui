import { H2, SubmitButton, Theme, YStack, isWeb, useToastController } from '@my/ui'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useRouter } from 'solito/router'
import { z } from 'zod'

const ChangePasswordSchema = z
  .object({
    password: formFields.text.min(6).describe('New Password // Enter your new password'),
    passwordConfirm: formFields.text.min(6).describe('Confirm Password // Repeat your password'),
  })
  .superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
      ctx.addIssue({
        path: ['passwordConfirm'],
        code: 'custom',
        message: 'The passwords did not match',
      })
    }
  })

export const ChangePasswordScreen = () => {
  const supabase = useSupabase()
  const toast = useToastController()
  const router = useRouter()

  const handleChangePassword = async ({ password }: z.infer<typeof ChangePasswordSchema>) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      toast.show(error.message)
    } else {
      toast.show('Successfully updated!')
      if (!isWeb) {
        router.back()
      }
    }
  }

  return (
    <SchemaForm
      onSubmit={handleChangePassword}
      schema={ChangePasswordSchema}
      defaultValues={{
        password: '',
        passwordConfirm: '',
      }}
      props={{
        password: {
          secureTextEntry: true,
        },
        passwordConfirm: {
          secureTextEntry: true,
        },
      }}
      renderBefore={() =>
        isWeb && (
          <YStack px="$4" py="$4" pb="$2">
            <H2>Change Password</H2>
          </YStack>
        )
      }
      renderAfter={({ submit }) => (
        <Theme inverse>
          <SubmitButton onPress={() => submit()}>Update Password</SubmitButton>
        </Theme>
      )}
    />
  )
}
