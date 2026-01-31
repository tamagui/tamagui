import { useUser } from "~/features/user/useUser";
import { accountModal } from "./accountModalStore";
import { getActivePromo } from "./promoConfig";
import { purchaseModal } from "./purchaseModalStore";

/**
 * Check if the URL has the test purchase query param
 * Only works for developers in the whitelist
 */
const isTestPurchaseMode = (): boolean => {
	if (typeof window === "undefined") return false;
	const params = new URLSearchParams(window.location.search);
	return params.get("testPurchase") === "true";
};

/**
 * This hook is used to show the appropriate modal based on the user's subscription status.
 * - If the user is not logged in, it shows the purchase modal.
 * - If the user is logged in and does not have an active subscription, it shows the purchase modal.
 * - If the user is logged in and has an active subscription, it shows the account modal.
 * - If the user is a developer with ?testPurchase=true, it shows the purchase modal.
 *
 * automatically applies any active promo from promoConfig
 */
export const useSubscriptionModal = () => {
	const { data: userData, isLoading, subscriptionStatus } = useUser();

	const showAppropriateModal = () => {
		if (isLoading) return;

		// developers can bypass pro check with ?testPurchase=true
		const devTestMode = subscriptionStatus.isDeveloper && isTestPurchaseMode();

		if (subscriptionStatus.pro && !devTestMode) {
			accountModal.show = true;
		} else {
			// always apply active promo if one exists
			const activePromo = getActivePromo();
			if (activePromo) {
				purchaseModal.activePromo = activePromo;
				purchaseModal.prefilledCouponCode = activePromo.code;
			} else {
				purchaseModal.activePromo = null;
				purchaseModal.prefilledCouponCode = null;
			}

			// for dev test mode, prefill the test coupon
			if (devTestMode) {
				purchaseModal.prefilledCouponCode = "DEV_TEST_99";
			}

			purchaseModal.show = true;
		}
	};

	return {
		showAppropriateModal,
		isLoading,
		userData,
		subscriptionStatus,
	};
};
