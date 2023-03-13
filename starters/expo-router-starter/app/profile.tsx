import { Link } from 'expo-router'
import { Button, H1, Stack } from 'tamagui'
export default function Profile() {
  return (
    <Stack padding="$-16">
      <H1>Profile Page</H1>
      <Link href={'/'}>
        <Button>Go to home page</Button>
      </Link>
    </Stack>
  )
}
