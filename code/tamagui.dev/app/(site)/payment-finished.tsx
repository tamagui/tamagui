import { useRouter } from 'one'
import { useEffect } from 'react'
import { H1, H4, Paragraph, YStack } from 'tamagui'
import { HeadInfo } from '~/components/HeadInfo'
import { accountModal } from '~/features/site/purchase/NewAccountModal'
import { ContainerLarge } from '../../components/Containers'

export default function PaymentFinishedPage() {
  const router = useRouter()

  useEffect(() => {
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

      <ContainerLarge>
        <YStack gap="$2">
          <H1 ff="$mono">Payment complete! 🎉</H1>

          <H4 ff="$mono">We appreciate your support</H4>

          <Paragraph>
            Your account and all assets are always available to access and manage via the
            account modal.
          </Paragraph>

          <Paragraph>
            We're checking for the Stripe webhook, once complete your Account modal should
            open and you can access your assets.
          </Paragraph>
        </YStack>
      </ContainerLarge>
    </>
  )
}
