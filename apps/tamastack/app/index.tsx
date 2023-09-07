import { Stack, Text } from '@tamagui/core'
import { Link } from '@tamagui/expo-router'

export default () => (
  <>
    <Stack w={100} h={100} bc="pink">
      <Text>hi from home</Text>
    </Stack>
    <Link
      href={{
        pathname: '/[user]',
        params: { user: 'abc' },
      }}
    >
      Go to "other"
    </Link>
  </>
)
