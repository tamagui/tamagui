import { useEffect } from 'react'
import { Spinner, YStack } from 'tamagui'
import { useRouter } from 'one'
import { HeadInfo } from '~/components/HeadInfo'
import { UserGuard } from '~/features/user/useUser'
import { accountModal } from '~/features/site/purchase/NewAccountModal'

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

      <UserGuard>
        <YStack ai="center" flex={1} jc="center">
          <Spinner size="large" />
        </YStack>
      </UserGuard>
    </>
  )
}
