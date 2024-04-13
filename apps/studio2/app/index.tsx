import { Link } from '@vxrn/expo-router'
import { View, Text } from 'react-native'

export default () => {
  return (
    <>
      <View>
        <Text style={{ color: 'blue' }}>Hi from home</Text>
      </View>
      <Link
        href={{
          pathname: '/[user]',
          params: { user: 'abc' },
        }}
      >
        <Text>Go to "other"</Text>
      </Link>
    </>
  )
}
