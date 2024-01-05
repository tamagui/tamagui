// debug-verbose
// import './wdyr'

import { CheckboxDemo, SwitchDemo } from '@tamagui/demos'
import { View } from 'react-native'
import { Button, H2, Square, styled } from 'tamagui'

const Test = styled(Square, {
  $gtSm: {
    backgroundColor: 'red',
  },
})

export const Sandbox = () => {
  return (
    <View>
      <SwitchDemo />
      {/* <CheckboxDemo /> */}
    </View>
  )
}
