import { SupabaseProvider } from '@components/SupabaseProvider'

export function withSupabase(page, pageProps, isStudio: boolean) {
  return (
    <SupabaseProvider isStudio={isStudio} initialSession={pageProps.initialSession}>
      {page}
    </SupabaseProvider>
  )
}
