import { useSearchParams } from 'one'
import { useEffect, useState } from 'react'
import { Button, H1, Paragraph, Spinner, YStack } from 'tamagui'
import { Container } from '../../../components/Containers'
import { HeadInfo } from '~/components/HeadInfo'
import { Link } from '~/components/Link'

type Status = 'idle' | 'loading' | 'success' | 'already_enabled' | 'error'

export default function EnableV2RenewalPage() {
  const params = useSearchParams()
  const subId = params.get('sub_id')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!subId) {
      setStatus('error')
      setError('Missing subscription ID')
      return
    }

    // call the API to enable V2 renewal
    // this is in useEffect so it only runs client-side (prevents email prefetch)
    const enableV2Renewal = async () => {
      setStatus('loading')
      try {
        const response = await fetch('/api/enable-v2-renewal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription_id: subId }),
        })

        const data = await response.json()

        if (!response.ok) {
          setStatus('error')
          setError(data.error || 'Failed to enable V2 renewal')
          return
        }

        if (data.alreadyEnabled) {
          setStatus('already_enabled')
        } else {
          setStatus('success')
        }
      } catch (err) {
        setStatus('error')
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      }
    }

    enableV2Renewal()
  }, [subId])

  return (
    <>
      <HeadInfo title="Enable New Pro Plan" />

      <Container py="$8">
        <YStack
          gap="$4"
          maxWidth={600}
          alignItems="center"
          justifyContent="center"
          mx="auto"
        >
          {status === 'loading' && (
            <>
              <Spinner size="large" color="$color10" />
              <H1 fontFamily="$mono" textAlign="center">
                Enabling New Pro Plan...
              </H1>
              <Paragraph size="$5" textAlign="center" color="$color10">
                Please wait while we update your subscription.
              </Paragraph>
            </>
          )}

          {status === 'success' && (
            <>
              <H1 fontFamily="$mono" textAlign="center">
                New Pro Plan Enabled! 🎉
              </H1>
              <Paragraph size="$5" textAlign="center">
                When your current subscription renews, you'll automatically be upgraded to
                the <strong>new Pro plan</strong> with <strong>35% off</strong>.
              </Paragraph>
              <Paragraph size="$4" textAlign="center" color="$color10">
                You'll receive a confirmation email shortly. You can manage your
                subscription anytime from your account.
              </Paragraph>
              <Link href="/account">
                <Button size="$4" theme="accent" mt="$4">
                  Go to Account
                </Button>
              </Link>
            </>
          )}

          {status === 'already_enabled' && (
            <>
              <H1 fontFamily="$mono" textAlign="center">
                Already Enabled ✓
              </H1>
              <Paragraph size="$5" textAlign="center">
                The new Pro plan is already enabled for this subscription. You're all set!
              </Paragraph>
              <Paragraph size="$4" textAlign="center" color="$color10">
                When your current subscription renews, you'll automatically get the new
                Pro plan with 35% off.
              </Paragraph>
              <Link href="/account">
                <Button size="$4" theme="accent" mt="$4">
                  Go to Account
                </Button>
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <H1 fontFamily="$mono" textAlign="center">
                Something went wrong
              </H1>
              <Paragraph size="$5" textAlign="center" color="$red10">
                {error}
              </Paragraph>
              <Paragraph size="$4" textAlign="center" color="$color10">
                Please try again or contact support at{' '}
                <Link href="mailto:support@tamagui.dev">support@tamagui.dev</Link>
              </Paragraph>
              <Link href="/account">
                <Button size="$4" mt="$4">
                  Go to Account
                </Button>
              </Link>
            </>
          )}
        </YStack>
      </Container>
    </>
  )
}
