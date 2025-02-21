import { createUseStore } from '@tamagui/use-store'

class TakeoutStore {
  showPurchase = false
  showTakeoutFaq = false
  showTakeoutAgreement = false
  showBentoFaq = false
  showBentoAgreement = false
  showTakeoutPolicies = false
  showBentoPolicies = false

  showProAgreement = false
  showProPolicies = false

  disableAutomaticDiscount = false
}

export const useTakeoutStore = createUseStore(TakeoutStore)
