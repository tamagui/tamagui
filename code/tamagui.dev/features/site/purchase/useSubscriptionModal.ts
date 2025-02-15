import { useUser } from '~/features/user/useUser'
import { purchaseModal } from './NewPurchaseModal'
import { accountModal } from './NewAccountModal'

export const useSubscriptionModal = () => {
  const { data: userData, isLoading } = useUser()

  const showAppropriateModal = () => {
    if (isLoading) return

    const hasActiveSub = userData?.subscriptions?.some(
      (sub) =>
        (sub.status === 'active' ||
          sub.status === 'trialing' ||
          sub.status === 'incomplete') &&
        sub.subscription_items?.some(
          (item) => item.price?.product?.name === 'Tamagui Pro'
        )
    )

    if (hasActiveSub) {
      accountModal.show = true
    } else {
      purchaseModal.show = true
    }
  }

  return {
    showAppropriateModal,
    isLoading,
    userData,
  }
}
