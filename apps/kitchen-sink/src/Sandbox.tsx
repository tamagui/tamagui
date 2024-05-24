//! tamagui-ignore
//! debug-verbose
import './wdyr'

import { AnimatePresence, Button, Square, YStack, styled } from 'tamagui'

import { useState } from 'react'
import { View as RNView } from 'react-native'

export const Sandbox = () => {
  return (
    <RNView style={{ width: '100%', height: '100%', padding: 50 }}>
      <Square size={200} bg="$red10" />
    </RNView>
  )
}
