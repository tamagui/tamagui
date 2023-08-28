import { Avatar, FullscreenSpinner, SubmitButton, Theme, YStack, useToastController } from '@my/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { createParam } from 'solito'
import { SolitoImage } from 'solito/image'
import { useRouter } from 'solito/router'
import { z } from 'zod'
import { UploadAvatar } from '../settings/components/upload-avatar'

const { useParams } = createParam<{ edit_name?: '1'; edit_about?: '1' }>()
export const EditProfileScreen = () => {
  const { profile, user } = useUser()

  if (!profile || !user?.id) {
    return <FullscreenSpinner />
  }
  return <EditProfileForm userId={user.id} initial={{ name: profile.name, about: profile.about }} />
}

const ProfileSchema = z.object({
  name: formFields.text.describe('Name // John Doe'),
  about: formFields.textarea.describe('About // Tell us a bit about yourself'),
})

const EditProfileForm = ({
  initial,
  userId,
}: {
  initial: { name: string | null; about: string | null }
  userId: string
}) => {
  const { params } = useParams()
  const supabase = useSupabase()
  const toast = useToastController()
  const queryClient = useQueryClient()
  const router = useRouter()
  const mutation = useMutation({
    async mutationFn(data: z.infer<typeof ProfileSchema>) {
      await supabase
        .from('profiles')
        .update({ name: data.name, about: data.about })
        .eq('id', userId)
    },
    async onSuccess() {
      toast.show('Successfully updated!')
      await queryClient.invalidateQueries(['profile'])
      router.back()
    },
  })

  return (
    <SchemaForm
      schema={ProfileSchema}
      props={{
        name: {
          autoFocus: !!params?.edit_name,
        },
        about: {
          autoFocus: !!params?.edit_about,
        },
      }}
      defaultValues={{
        name: initial.name ?? '',
        about: initial.about ?? '',
      }}
      onSubmit={(values) => mutation.mutate(values)}
      renderAfter={({ submit }) => (
        <Theme inverse>
          <SubmitButton onPress={() => submit()}>Update Profile</SubmitButton>
        </Theme>
      )}
    >
      {(fields) => (
        <>
          <YStack mb="$10">
            <UploadAvatar>
              <UserAvatar />
            </UploadAvatar>
          </YStack>
          {Object.values(fields)}
        </>
      )}
    </SchemaForm>
  )
}

const UserAvatar = () => {
  const { avatarUrl } = useUser()
  return (
    <Avatar circular size={128}>
      <SolitoImage src={avatarUrl} alt="your avatar" width={128} height={128} />
    </Avatar>
  )
}
