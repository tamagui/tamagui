import { useUser } from '~/features/user/useUser'
import { purchaseModal } from './NewPurchaseModal'
import { accountModal } from './NewAccountModal'
import { useMemo } from 'react'

/**
 * This hook is used to show the appropriate modal based on the user's subscription status.
 * - If the user is not logged in, it shows the purchase modal.
 * - If the user is logged in and does not have an active subscription, it shows the purchase modal.
 * - If the user is logged in and has an active subscription, it shows the account modal.
 */
export const useSubscriptionModal = () => {
  const { data: userData, isLoading } = useUser()

  const isProUser = useMemo(() => {
    return (
      userData?.subscriptions?.some(
        (sub) => sub.status === 'active' || sub.status === 'trialing'
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
      // purchaseModal.show = true // DEBUG
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
