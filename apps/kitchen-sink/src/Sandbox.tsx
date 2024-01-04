// debug-verbose
// import './wdyr'

import { useState } from 'react'
import { View } from 'react-native'

export const Sandbox = () => {
  const [disabled, setDisabled] = useState(true)
  return (
    <View style={{ width: '100%', height: '100%', padding: 50 }}>
      <></>
    </View>
  )
}
