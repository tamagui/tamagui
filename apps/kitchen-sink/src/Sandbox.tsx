// debug-verbose
// import './wdyr'

import { useState } from 'react'
import { View } from 'react-native'
import { Button, H2, Square, styled } from 'tamagui'

const Test = styled(Square, {
  $gtSm: {
    backgroundColor: 'red',
  },
})

export const Sandbox = () => {
  const [disabled, setDisabled] = useState(true)
  return (
    <View style={{ width: '100%', height: '100%', padding: 50 }}>
      <>
        <Button disabled={disabled}>Go to user page</Button>
        <Button onPress={() => setDisabled(!disabled)}>Go to tabs page</Button>
      </>
    </View>
  )
}
