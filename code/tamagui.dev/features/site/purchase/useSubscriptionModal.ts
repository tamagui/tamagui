import { useUser } from '~/features/user/useUser'
import { accountModal } from './accountModalStore'
import { purchaseModal } from './purchaseModalStore'

/**
 * This hook is used to show the appropriate modal based on the user's subscription status.
 * - If the user is not logged in, it shows the purchase modal.
 * - If the user is logged in and does not have an active subscription, it shows the purchase modal.
 * - If the user is logged in and has an active subscription, it shows the account modal.
 */
export const useSubscriptionModal = () => {
  const { data: userData, isLoading, subscriptionStatus } = useUser()

  const showAppropriateModal = () => {
    if (isLoading) return
    if (subscriptionStatus.pro) {
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
    subscriptionStatus,
  }
}
