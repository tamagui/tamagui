// debug-verbose
// import './wdyr'

import {
  CheckboxDemo,
  CheckboxHeadlessDemo,
  SwitchDemo,
  SwitchHeadlessDemo,
} from '@tamagui/demos'
import { useState } from 'react'
import { View } from 'react-native'

export const Sandbox = () => {
  const [disabled, setDisabled] = useState(true)
  return (
    <View>
      <SwitchDemo />
      <SwitchHeadlessDemo />

      <form>
        <CheckboxDemo />
        <CheckboxHeadlessDemo />
      </form>
    </View>
  )
}
