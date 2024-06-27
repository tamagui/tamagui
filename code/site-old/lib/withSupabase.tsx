import { SupabaseProvider } from '@components/SupabaseProvider'

export function withSupabase(page, pageProps, isStudio = false) {
  return (
    <SupabaseProvider isStudio={isStudio} initialSession={pageProps.initialSession}>
      {page}
    </SupabaseProvider>
  )
}
