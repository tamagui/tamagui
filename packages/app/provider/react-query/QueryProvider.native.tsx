import NetInfo from '@react-native-community/netinfo'
import {
  QueryClient,
  QueryClientProvider as QueryClientProviderOG,
  focusManager,
  onlineManager,
} from '@tanstack/react-query'
import { api, createTrpcClient } from 'app/utils/api.native'
import { useEffect, useState } from 'react'
import type { AppStateStatus } from 'react-native'
import { AppState, Platform } from 'react-native'

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected)
  })
})

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

export const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange)

    return () => subscription.remove()
  }, [])

  const [queryClient] = useState(
    new QueryClient({
      // native query config
    })
  )

  const [trpcClient] = useState(createTrpcClient())

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProviderOG client={queryClient}>{children}</QueryClientProviderOG>
    </api.Provider>
  )
}
