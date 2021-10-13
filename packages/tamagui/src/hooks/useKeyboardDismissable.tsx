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

import { isWeb } from '@tamagui/core'
import { useEffect } from 'react'
import { BackHandler } from 'react-native'

type IParams = {
  enabled?: boolean
  callback: () => any
}

let keyboardDismissHandlers: Array<() => any> = []
export const keyboardDismissHandlerManager = {
  push: (handler: () => any) => {
    keyboardDismissHandlers.push(handler)
    return () => {
      keyboardDismissHandlers = keyboardDismissHandlers.filter((h) => h !== handler)
    }
  },
  length: () => keyboardDismissHandlers.length,
  pop: () => {
    return keyboardDismissHandlers.pop()
  },
}

export const useKeyboardDismissable = ({ enabled, callback }: IParams) => {
  useEffect(() => {
    let cleanupFn = () => {}
    if (enabled) {
      cleanupFn = keyboardDismissHandlerManager.push(callback)
    } else {
      cleanupFn()
    }
    return () => {
      cleanupFn()
    }
  }, [enabled, callback])

  useBackHandler({ enabled, callback })
}

const callbackOnEscape = (callback) => (e) => {
  if (e.key === 'Escape') {
    if (
      !(document.activeElement instanceof HTMLInputElement) &&
      !(document.activeElement instanceof HTMLTextAreaElement)
    ) {
      e.preventDefault()
      e.stopPropagation()
      callback()
    }
  }
}

export function useBackHandler({ enabled, callback }: IParams) {
  useEffect(() => {
    let backHandler = () => {
      callback()
      return true
    }
    const keyHandler = callbackOnEscape(callback)
    if (enabled) {
      BackHandler.addEventListener('hardwareBackPress', backHandler)
      if (isWeb) {
        window.addEventListener('keydown', keyHandler)
      }
    } else {
      BackHandler.removeEventListener('hardwareBackPress', backHandler)
    }
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backHandler)
      if (isWeb) {
        window.removeEventListener('keydown', keyHandler)
      }
    }
  }, [enabled, callback])
}
