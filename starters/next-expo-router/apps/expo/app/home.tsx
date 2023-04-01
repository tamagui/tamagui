import { Link } from 'expo-router'
import { Text } from 'react-native'
import { Stack } from 'tamagui'

export default function Home() {
  return (
    <Stack padding={50}>
      <Text>Home page</Text>
      <Link href="/">Go to root</Link>
    </Stack>
  )
}
