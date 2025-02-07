import { Link, useLoader } from 'one'
import { Circle, YStack } from 'tamagui'

export async function loader() {
  await new Promise((res) => setTimeout(res, 500))
}

export default () => {
  const data = useLoader(loader)

  return (
    <YStack>
      <Link href="/sandbox">Go to sandbox</Link>

      <Circle size={200} bg="green" />
    </YStack>
  )
}
