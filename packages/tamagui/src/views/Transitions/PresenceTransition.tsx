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

import React, { forwardRef, memo } from 'react'

import { ExitAnimationContext } from '../ExitAnimationContext'
import { Transition } from './Transition'
import type { IPresenceTransitionProps } from './types'

export const PresenceTransition = memo(
  forwardRef(({ visible = false, onTransitionComplete, ...rest }: IPresenceTransitionProps, ref: any) => {
    const [animationExited, setAnimationExited] = React.useState(!visible)

    const { setExited } = React.useContext(ExitAnimationContext)

    if (!visible && animationExited) {
      return null
    }

    return (
      <Transition
        visible={visible}
        onTransitionComplete={(state) => {
          if (state === 'exited') {
            setAnimationExited(true)
            setExited(true)
          } else {
            setAnimationExited(false)
            setExited(false)
          }
          onTransitionComplete && onTransitionComplete(state)
        }}
        {...rest}
        ref={ref}
      />
    )
  })
)
