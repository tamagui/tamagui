import { useUser } from '~/features/user/useUser'
import { purchaseModal } from './NewPurchaseModal'
import { accountModal } from './NewAccountModal'
import { useMemo } from 'react'

export const useSubscriptionModal = () => {
  const { data: userData, isLoading } = useUser()

  const isProUser = useMemo(() => {
    return (
      userData?.subscriptions?.some(
        (sub) =>
          sub.status === 'active' ||
          sub.status === 'trialing' ||
          sub.status === 'incomplete'
      ) &&
      userData?.subscriptions?.some((sub) =>
        sub.subscription_items?.some(
          (item) => item.price?.product?.name === 'Tamagui Pro'
        )
      )
    )
  }, [userData])

  const showAppropriateModal = () => {
    if (isLoading) return
    if (isProUser) {
      accountModal.show = true
    } else {
      purchaseModal.show = true
    }
  }

  return {
    showAppropriateModal,
    isLoading,
    userData,
    isProUser,
  }
}
