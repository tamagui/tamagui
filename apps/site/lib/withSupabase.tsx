import { SupabaseProvider } from '@components/SupabaseProvider'

export function withSupabase(page, pageProps) {
  return (
    <SupabaseProvider initialSession={pageProps.initialSession}>{page}</SupabaseProvider>
  )
}
