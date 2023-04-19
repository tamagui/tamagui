import { SupabaseProvider } from '@components/SupabaseProvider'
import { MyUserContextProvider } from 'hooks/useUser'
import { H1 } from 'tamagui'

export function withSupabase(page, pageProps) {
  return (
    <SupabaseProvider initialSession={pageProps.initialSession}>
      <UserLayout>{page}</UserLayout>
    </SupabaseProvider>
  )
}

function UserLayout({ children }) {
  return <MyUserContextProvider>{children}</MyUserContextProvider>
}
