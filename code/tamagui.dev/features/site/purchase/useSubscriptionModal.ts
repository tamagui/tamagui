import { useUser } from '~/features/user/useUser'
import { accountModal } from './accountModalStore'
import type { PromoConfig } from './promoConfig'
import { getActivePromo } from './promoConfig'
import { purchaseModal } from './purchaseModalStore'

/**
 * This hook is used to show the appropriate modal based on the user's subscription status.
 * - If the user is not logged in, it shows the purchase modal.
 * - If the user is logged in and does not have an active subscription, it shows the purchase modal.
 * - If the user is logged in and has an active subscription, it shows the account modal.
 *
 * optionally accepts a promo to pre-fill coupon code in the purchase flow
 */
export const useSubscriptionModal = () => {
  const { data: userData, isLoading, subscriptionStatus } = useUser()

  const showAppropriateModal = (promo?: PromoConfig | null) => {
    if (isLoading) return
    if (subscriptionStatus.pro) {
      accountModal.show = true
      // purchaseModal.show = true // DEBUG
    } else {
      // set promo info if provided
      if (promo) {
        purchaseModal.activePromo = promo
        purchaseModal.prefilledCouponCode = promo.code
      } else {
        purchaseModal.activePromo = null
        purchaseModal.prefilledCouponCode = null
      }
      purchaseModal.show = true
    }
  }

  // convenience method to show modal with active promo
  const showWithActivePromo = () => {
    const activePromo = getActivePromo()
    showAppropriateModal(activePromo)
  }

  return {
    showAppropriateModal,
    showWithActivePromo,
    isLoading,
    userData,
    subscriptionStatus,
  }
}
