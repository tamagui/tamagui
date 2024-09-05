import { isTouchable, isWeb } from '@tamagui/constants'
import { useDidFinishSSR } from '@tamagui/use-did-finish-ssr'

export const useIsTouchDevice = () => {
  return !isWeb ? true : useDidFinishSSR() ? isTouchable : false
}
