import { useSyncExternalStore } from 'react'

const nullSubscribe = () => {
  return () => {}
}

export const useIsHydrated = () => {
  return useSyncExternalStore(
    nullSubscribe,
    () => true,
    () => false
  )
}
