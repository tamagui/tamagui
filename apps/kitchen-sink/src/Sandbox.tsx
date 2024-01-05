// debug-verbose
// import './wdyr'

import { CheckboxDemo, SwitchDemo } from '@tamagui/demos'
import { useState } from 'react'
import { View } from 'react-native'

export const Sandbox = () => {
  const [disabled, setDisabled] = useState(true)
  return (
    <View>
      {/* <SwitchDemo /> */}
      <CheckboxDemo />
    </View>
  )
}
