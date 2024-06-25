import { NextSeo } from 'next-seo'
import { useRouter } from 'vxs'
import { useEffect } from 'react'
import { Spinner, YStack } from 'tamagui'
import { UserGuard } from '~/features/user/useUser'

export default function PaymentFinishedPage() {
  const router = useRouter()

  useEffect(() => {
    // take some time for stripe to hit our webhook
    const id = setTimeout(() => {
      router.replace('/account/items')
    }, 5_000)
    return () => {
      clearTimeout(id)
    }
  }, [router.replace])

  return (
    <>
      <NextSeo title="Account" />

      <UserGuard>
        <YStack ai="center" flex={1} jc="center">
          <Spinner size="large" />
        </YStack>
      </UserGuard>
    </>
  )
}
