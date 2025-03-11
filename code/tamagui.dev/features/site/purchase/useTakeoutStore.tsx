import { createUseStore } from '@tamagui/use-store'

class TakeoutStore {
  showPurchase = false

  showProAgreement = false
  showProPolicies = false
}

export const useTakeoutStore = createUseStore(TakeoutStore)
