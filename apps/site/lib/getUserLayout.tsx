import { MyUserContextProvider } from 'hooks/useUser'

export function getUserLayout(page) {
  return <UserLayout>{page}</UserLayout>
}

function UserLayout({ children }) {
  return (
    <MyUserContextProvider>
      {children}
    </MyUserContextProvider>
  )
}
