import { useClientValue } from '@tamagui/core'

export const useOfflineMode = () => {
  return useClientValue(() => window.location.search?.includes(`offline`))
}
