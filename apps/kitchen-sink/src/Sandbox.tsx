// import './wdyr'

import { DialogDemo, ToastDemo } from '@tamagui/demos'
import { ToastProvider, ToastViewport } from '@tamagui/toast'
import { View } from 'react-native'

export const Sandbox = () => {
  return (
    <View style={{ width: '100%', height: '100%', padding: 50 }}>
      <>
        <ToastDemo />
        <DialogDemo />
        <ToastViewport />
      </>
    </View>
  )
}
