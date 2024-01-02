// debug-verbose
// import './wdyr'

import { View } from 'react-native'
import { Button, H2, Square, styled } from 'tamagui'

const Test = styled(Square, {
  $gtSm: {
    backgroundColor: 'red',
  },
})

export const Sandbox = () => {
  return (
    <View style={{ width: '100%', height: '100%', padding: 50 }}>
      <>
        <Button fontWeight="800">hi</Button>
      </>
    </View>
  )
}
