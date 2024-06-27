import { Container } from '@components/Container'
import { SupabaseProvider } from '@components/SupabaseProvider'
import { getDefaultLayout } from '@lib/getDefaultLayout'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { UserGuard, useUser } from 'hooks/useUser'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import {
  Button,
  Fieldset,
  Form,
  H2,
  Input,
  Label,
  Paragraph,
  Spinner,
  XStack,
  YStack,
} from 'tamagui'

export default function Page(props) {
  return (
    <SupabaseProvider initialSession={props.initialSession}>
      <NextSeo title="Account — Tamagui" description="A better universal UI system." />

      <UserGuard>
        <ChangeEmail />
      </UserGuard>
    </SupabaseProvider>
  )
}

const ChangeEmail = () => {
  const { isLoading, data } = useUser()
  const router = useRouter()

  const message = useMemo(() => {
    const parsedHash = new URLSearchParams(location.hash.substring(1))
    return parsedHash.get('message')
  }, [router.asPath])

  if (isLoading || !data) {
    return <Spinner my="$10" />
  }

  return (
    <Container f={1}>
      <YStack mt="$10" space ai="center">
        <H2>Change Email</H2>
        {!!message && <Paragraph theme="green_alt2">{message}</Paragraph>}
        <ChangeEmailForm />
      </YStack>
    </Container>
  )
}

const ChangeEmailForm = () => {
  const { data: userData, mutate: updateUserSwr } = useUser()

  const email = userData?.user.email
  const [newEmail, setNewEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = useSupabaseClient()
  const handleUpdateEmail = async () => {
    if (loading) return
    setLoading(true)
    if (!newEmail) {
      setErrorMessage('Enter your new email first.')
      setLoading(false)
      return
    }
    setErrorMessage('')
    const { error } = await supabase.auth.updateUser(
      { email: newEmail },
      { emailRedirectTo: `${location.origin}/account/change-email` }
    )

    if (error) {
      setErrorMessage(error.message)
      setLoading(false)
      return
    }
    // await updateUserSwr()
    setLoading(false)
    alert("We've sent your new email a confirmation. Make sure to check spam.")
  }

  return (
    <Form gap="$4" onSubmit={handleUpdateEmail} width={400}>
      <Fieldset>
        <Label htmlFor="current-email">Current Email</Label>
        <Input id="current-email" disabled value={email} />
      </Fieldset>
      <Fieldset>
        <Label htmlFor="new-email">New Email</Label>
        <Input
          id="new-email"
          value={newEmail}
          onChangeText={(text) => setNewEmail(text)}
          keyboardType="email-address"
        />
      </Fieldset>

      {errorMessage && <Paragraph theme="red_alt2">{errorMessage}</Paragraph>}

      <Form.Trigger>
        <Button themeInverse disabled={loading}>
          Submit
        </Button>
      </Form.Trigger>
    </Form>
  )
}

Page.getLayout = getDefaultLayout
