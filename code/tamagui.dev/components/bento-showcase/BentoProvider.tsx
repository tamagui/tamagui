import { createContext } from 'tamagui'

export type BentoShowcaseContext = {
  showAppropriateModal: () => void
  isProUser: boolean
}

export const [BentoShowcaseProvider, useBentoShowcase] =
  createContext<BentoShowcaseContext>('BentoProvider', {
    showAppropriateModal: () => {},
    isProUser: false,
  })
