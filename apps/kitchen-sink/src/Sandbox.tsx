// debug-verbose
// import './wdyr'

import { View } from 'react-native'
import { Square, styled } from 'tamagui'

const Test = styled(Square, {
  $gtSm: {
    backgroundColor: 'red',
  },
})

export const Sandbox = () => {
  return (
    <View style={{ width: '100%', height: '100%', padding: 50 }}>
      <>
        <Test
          debug="verbose"
          size={100}
          $gtSm={{
            borderWidth: 2,
            borderColor: 'blue',
          }}
        />
      </>
    </View>
  )
}
