import { Text, Stack } from 'tamagui'
import { Link } from 'expo-router'

export default function App() {
  return (
    <Stack padding={50}>
      <Text>This is another index.ts</Text>
      <Link href="/home">Go to Home</Link>
    </Stack>
  )
}
