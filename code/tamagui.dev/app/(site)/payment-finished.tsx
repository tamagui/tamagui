import { useRouter } from 'one'
import { useEffect } from 'react'
import { H1, H4, Paragraph, YStack } from 'tamagui'
import { HeadInfo } from '~/components/HeadInfo'
import { sendEvent } from '~/features/analytics/sendEvent'
import { accountModal } from '~/features/site/purchase/accountModalStore'
import { Container } from '../../components/Containers'

export default function PaymentFinishedPage() {
  const router = useRouter()

  useEffect(() => {
    sendEvent('Pro: Payment Success (landed)')

    // take some time for stripe to hit our webhook
    const id = setTimeout(() => {
      accountModal.show = true
    }, 5_000)
    return () => {
      clearTimeout(id)
    }
  }, [router.replace])

  return (
    <>
      <HeadInfo title="Account" />

      <Container py="$8">
        <YStack gap="$4" maxWidth={600}>
          <H1 fontFamily="$mono">Payment complete! 🎉</H1>

          <H4 fontFamily="$mono">We appreciate your support</H4>

          <Paragraph size="$5">
            Your account and all assets are always available to access and manage via the
            account modal.
          </Paragraph>

          <Paragraph size="$4" color="$color10">
            We're checking for the Stripe webhook, once complete your Account modal should
            open and you can set up your project.
          </Paragraph>
        </YStack>
      </Container>
    </>
  )
}
