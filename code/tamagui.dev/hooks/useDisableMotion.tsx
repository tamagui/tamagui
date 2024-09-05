import { useClientValue } from '@tamagui/use-did-finish-ssr'
import { isClient } from 'tamagui'

export const useDisableMotion = () => {
  return useClientValue(
    isClient &&
      (window.matchMedia(`(prefers-reduced-motion: reduce)`)?.matches ||
        window.location.search?.includes('disable-motion') ||
        /firefox/i.test(navigator.userAgent || ''))
  )
}
