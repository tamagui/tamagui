import { createUseStore } from '@tamagui/use-store'

class TakeoutStore {
  showPurchase = false
  showAgreement = false

  showProAgreement = false
  showProPolicies = false

  disableAutomaticDiscount = false
}

export const useTakeoutStore = createUseStore(TakeoutStore)
