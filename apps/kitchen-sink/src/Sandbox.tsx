//! tamagui-ignore
//! debug-verbose
import './wdyr'

import { AnimatePresence, Button, Circle, Square, YStack, styled } from 'tamagui'
import { DatePickerExample } from '../../bento/src/components/elements/datepickers/DatePicker'

import { useState } from 'react'
import { View as RNView } from 'react-native'

export const Sandbox = () => {
  return (
    <RNView style={{ width: '100%', height: '100%', padding: 50 }}>
      {/* <Demo3 /> */}
      {/* <Circle
        debug="verbose"
        size={100}
        bg="red"
        animation="bouncy"
        enterStyle={{
          // opacity: 0,
          y: -100,
        }}
      /> */}

      <DatePickerExample />
    </RNView>
  )
}
