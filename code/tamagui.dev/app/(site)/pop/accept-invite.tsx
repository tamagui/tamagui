import { useSearchParams } from 'one'
import { useEffect, useState } from 'react'
import { Button, H2, Paragraph, Spinner, YStack } from 'tamagui'
import { HeadInfo } from '~/components/HeadInfo'
import { Link } from '~/components/Link'
import { authFetch } from '~/features/api/authFetch'

type Status = 'loading' | 'active' | 'pending' | 'error'

export default function AcceptInvitePage() {
  const params = useSearchParams()
  const subscriptionId = params.get('subscription_id')
  const productId = params.get('product_id')
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!subscriptionId || !productId) {
      setStatus('error')
      setError('Missing subscription information.')
      return
    }

    const sendInvite = async () => {
      try {
        const res = await authFetch('/api/resend-github-invite', {
          method: 'POST',
          body: JSON.stringify({
            subscription_id: subscriptionId,
            product_id: productId,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          setStatus('error')
          setError(data?.error || `Something went wrong (${res.status})`)
          return
        }

        setStatus(data.status === 'active' ? 'active' : 'pending')
      } catch (err) {
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    }

    sendInvite()
  }, [subscriptionId, productId])

  return (
    <>
      <HeadInfo title="GitHub Invite" />

      <YStack flex={1} items="center" justify="center" p="$4">
        <YStack
          gap="$4"
          maxWidth={420}
          items="center"
          p="$6"
          br="$6"
          bw={1}
          boc="$borderColor"
          bg="$color2"
        >
          {status === 'loading' && (
            <>
              <Spinner size="large" color="$color10" />
              <H2 size="$7" ta="center">
                Checking invite status...
              </H2>
            </>
          )}

          {status === 'active' && (
            <>
              <H2 size="$7" ta="center">
                You already have access
              </H2>
              <Paragraph ta="center" color="$color11">
                Your GitHub account is already a member of the Tamagui team.
              </Paragraph>
              <Button
                size="$4"
                theme="green"
                onPress={() =>
                  window.open(
                    'https://github.com/tamagui/takeout2',
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
              >
                Go to repo
              </Button>
            </>
          )}

          {status === 'pending' && (
            <>
              <H2 size="$7" ta="center">
                Invited to Tamagui GitHub
              </H2>
              <Paragraph ta="center" color="$color11">
                The invite should be in your inbox now.
              </Paragraph>
              <Button
                size="$4"
                theme="accent"
                onPress={() =>
                  window.open(
                    'https://github.com/orgs/tamagui/invitation',
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
              >
                Click here to accept
              </Button>
              <Paragraph size="$3" ta="center" color="$color9">
                If you don't see it, check your GitHub notifications or spam folder.
              </Paragraph>
            </>
          )}

          {status === 'error' && (
            <>
              <H2 size="$7" ta="center">
                Something went wrong
              </H2>
              <Paragraph ta="center" color="$red10">
                {error}
              </Paragraph>
              <Paragraph size="$3" ta="center" color="$color9">
                Need help?{' '}
                <Link href="mailto:team@tamagui.dev">team@tamagui.dev</Link>
              </Paragraph>
            </>
          )}
        </YStack>
      </YStack>
    </>
  )
}
