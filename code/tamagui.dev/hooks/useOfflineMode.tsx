import { useClientValue } from '@tamagui/style'

export const useOfflineMode = () => {
  return useClientValue(() => window.location.search?.includes(`offline`))
}
