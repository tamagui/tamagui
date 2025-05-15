import { Container } from '~/components/Containers'
import { AccountView } from '~/features/site/purchase/NewAccountModal'
import { UserGuard } from '~/features/user/useUser'

export default function AccountPage() {
  return (
    <UserGuard>
      <Container
        my="$10"
        py="$10"
        borderRadius="$10"
        justifyContent="center"
        alignItems="center"
        flex={1}
      >
        <AccountView />
      </Container>
    </UserGuard>
  )
}
