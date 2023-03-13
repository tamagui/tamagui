import { Link } from 'expo-router'
import { Button, H1, Stack } from 'tamagui'
export default function Root() {
  return (
    <Stack padding="$-16">
      <H1>Home page</H1>
      <Link href={'/profile'}>
        <Button>Go to profile page</Button>
      </Link>
    </Stack>
  )
}
