import { QueryClient, QueryClientProvider as QueryClientProviderOG } from '@tanstack/react-query'
import { useState } from 'react'

export const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    new QueryClient({
      // web query config
    })
  )
  return <QueryClientProviderOG client={queryClient}>{children}</QueryClientProviderOG>
}
