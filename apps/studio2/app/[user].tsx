import { Link, useGlobalSearchParams } from '@vxrn/expo-router'
import { Text, View } from 'react-native'

export default function User() {
  const params = useGlobalSearchParams()

  return (
    <View>
      <View>
        <Text>User: {params?.user}</Text>
        <Link
          href={{
            pathname: '/[...spread]',
            params: { spread: [Date.now(), 'other'] },
          }}
        >
          Go to multi-level user
        </Link>
        <Link
          href={{
            pathname: '/[user]',
            params: { user: params.user },
          }}
        >
          Go to same user
        </Link>
        <Link
          href={{
            pathname: '/[user]',
            params: { user: Date.now() },
          }}
        >
          Go to posts
        </Link>
        <Link
          replace
          href={{
            pathname: '/[user]',
            params: { user: Date.now() },
          }}
        >
          Go to posts (replace)
        </Link>
        <Link
          href={{
            pathname: '/other',
          }}
        >
          Go to "other"
        </Link>
      </View>
    </View>
  )
}
