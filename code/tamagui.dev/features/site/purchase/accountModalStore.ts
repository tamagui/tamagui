import { createStore, createUseStore } from '@tamagui/use-store'

class AccountModal {
  show = false
}

export const accountModal = createStore(AccountModal)
export const useAccountModal = createUseStore(AccountModal)
