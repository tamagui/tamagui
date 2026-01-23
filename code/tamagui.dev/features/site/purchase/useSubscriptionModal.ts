import { useUser } from '~/features/user/useUser'
import { accountModal } from './accountModalStore'
import { getActivePromo } from './promoConfig'
import { purchaseModal } from './purchaseModalStore'

/**
 * This hook is used to show the appropriate modal based on the user's subscription status.
 * - If the user is not logged in, it shows the purchase modal.
 * - If the user is logged in and does not have an active subscription, it shows the purchase modal.
 * - If the user is logged in and has an active subscription, it shows the account modal.
 *
 * automatically applies any active promo from promoConfig
 */
export const useSubscriptionModal = () => {
  const { data: userData, isLoading, subscriptionStatus } = useUser()

  const showAppropriateModal = () => {
    if (isLoading) return
    if (subscriptionStatus.pro) {
      accountModal.show = true
    } else {
      // always apply active promo if one exists
      const activePromo = getActivePromo()
      if (activePromo) {
        purchaseModal.activePromo = activePromo
        purchaseModal.prefilledCouponCode = activePromo.code
      } else {
        purchaseModal.activePromo = null
        purchaseModal.prefilledCouponCode = null
      }
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
