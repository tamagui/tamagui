import { useRouter } from 'one'
import { useEffect } from 'react'
import { Spinner, YStack } from 'tamagui'
import { accountModal } from '~/features/site/purchase/NewAccountModal'
import { useUser } from '~/features/user/useUser'

export default function AccountPage() {
  const router = useRouter()
  const { data, isLoading } = useUser()

  useEffect(() => {
    if (isLoading) return

    if (!data?.user) {
      router.push('/login')
      return
    }

    // redirect home and open the account modal
    accountModal.show = true
    router.push('/')
  }, [data, isLoading, router])

  return (
    <YStack items="center" flex={1} justify="center">
      <Spinner size="large" />
    </YStack>
  )
}
