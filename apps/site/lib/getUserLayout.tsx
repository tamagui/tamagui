import { MyUserContextProvider } from 'hooks/useUser'

export function getUserLayout(page) {
  return <UserLayout>{page}</UserLayout>
}

// TODO: this is already used in app.tsx... remove this?
function UserLayout({ children }) {
  return (
    <MyUserContextProvider>
      {children}
    </MyUserContextProvider>
  )
}
