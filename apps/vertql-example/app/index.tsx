import { Link } from '@tamagui/expo-router'
import { Button, Stack, Text } from 'tamagui'

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
      <Button>Go to "other"</Button>
    </Link>
  </>
)
