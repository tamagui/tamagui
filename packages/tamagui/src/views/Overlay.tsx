// forked from NativeBase
// The MIT License (MIT)

// Copyright (c) 2021 GeekyAnts India Pvt Ltd

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import { OverlayContainer } from '@react-native-aria/overlays'
import React, { useLayoutEffect } from 'react'
import { Modal, Platform } from 'react-native'

import { useKeyboardDismissable } from '../hooks/useKeyboardDismissable'

interface IOverlayProps {
  isOpen?: boolean
  children?: any
  // We use RN modal on android if needed as it supports shifting accessiblity focus to the opened view. IOS automatically shifts focus if an absolutely placed view appears in front.
  useRNModalOnAndroid?: boolean
  onRequestClose?: (() => any) | undefined
  isKeyboardDismissable?: boolean
}

export function Overlay({
  children,
  isOpen,
  useRNModalOnAndroid = false,
  isKeyboardDismissable = true,
  onRequestClose,
}: IOverlayProps) {
  const [openedOnce, setOpenedOnce] = React.useState(false)

  useKeyboardDismissable({
    enabled: isOpen && isKeyboardDismissable,
    callback: onRequestClose ? onRequestClose : () => {},
  })

  useLayoutEffect(() => {
    if (isOpen) {
      setOpenedOnce(true)
    }
  }, [isOpen])

  if (!openedOnce) {
    return null
  }

  // Android handles multiple Modal in RN and is better for accessibility as it shifts accessibility focus on mount, however it may not needed in case of tooltips, toast where one doesn't need to shift accessibility focus
  if (Platform.OS === 'android' && useRNModalOnAndroid) {
    return (
      <Modal transparent visible={true} onRequestClose={onRequestClose}>
        {children}
      </Modal>
    )
  }

  return <OverlayContainer>{children}</OverlayContainer>
}
