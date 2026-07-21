import { isTouchable, isWeb } from '@tamagui/constants'
import { useDidFinishSSR } from '@tamagui/use-did-finish-ssr'

export const useIsTouchDevice = () => {
  return !isWeb ? isTouchable : useDidFinishSSR() ? isTouchable : false
}
