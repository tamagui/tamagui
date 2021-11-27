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

import { useId } from '@react-aria/utils'
import { FocusScope } from '@react-native-aria/focus'
import React, { forwardRef, memo } from 'react'
import { StyleSheet, View } from 'react-native'

import { useControllableState } from '../../hooks/useControllableState'
import { Overlay } from '../Overlay'
import { Popper } from '../Popper'
import { PresenceTransition } from '../Transitions/PresenceTransition'
import { PopoverArrow } from './PopoverArrow'
import { PopoverContent } from './PopoverContent'
import { PopoverContext } from './PopoverContext'
import type { IPopoverProps } from './types'

interface PopoverI extends React.FunctionComponent<IPopoverProps> {
  Arrow: typeof PopoverArrow
  Content: typeof PopoverContent
}

const PopoverMain = memo(
  forwardRef(
    (
      {
        onOpen,
        trigger,
        onClose,
        isOpen: isOpenProp,
        children,
        defaultIsOpen,
        initialFocusRef,
        finalFocusRef,
        trapFocus = true,
        onChangeOpen,
        ...props
      }: IPopoverProps,
      ref: any
    ) => {
      const triggerRef = React.useRef(null)
      const [isOpen, setIsOpen] = useControllableState({
        value: isOpenProp,
        defaultValue: defaultIsOpen,
        onChange: (value) => {
          onChangeOpen?.(value)
          value ? onOpen && onOpen() : onClose && onClose()
        },
      })

      const [bodyMounted, setBodyMounted] = React.useState(false)
      const [headerMounted, setHeaderMounted] = React.useState(false)

      const popoverContentId = `${useId()}-content`
      const headerId = `${popoverContentId}-header`
      const bodyId = `${popoverContentId}-body`

      const handleOpen = React.useCallback(() => {
        setIsOpen(true)
      }, [setIsOpen])

      const updatedTrigger = () => {
        return trigger(
          {
            ref: triggerRef,
            onPress: handleOpen,
            'aria-expanded': isOpen ? true : false,
            'aria-controls': isOpen ? popoverContentId : undefined,
            'aria-haspopup': true,
          },
          { open: isOpen }
        )
      }

      const handleClose = () => {
        setIsOpen(false)
      }

      const childrenElements =
        typeof children === 'function' ? children({ open: isOpen }) : children

      return (
        <>
          <View style={{ display: 'none' }} ref={ref}></View>
          {updatedTrigger()}
          <Overlay isOpen={isOpen} onRequestClose={handleClose} useRNModalOnAndroid>
            <PresenceTransition
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 150 } }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 100 } }}
              visible={isOpen}
              style={StyleSheet.absoluteFill}
            >
              <Popper onClose={handleClose} triggerRef={triggerRef} {...props}>
                {/* <AbsoluteYStack
                  fullscreen
                  pointerEvents="auto"
                  backgroundColor="rgba(0,0,0,0.1)"
                  onPress={handleClose}
                /> */}
                <PopoverContext.Provider
                  value={{
                    onClose: handleClose,
                    initialFocusRef,
                    finalFocusRef,
                    popoverContentId,
                    bodyId,
                    headerId,
                    headerMounted,
                    bodyMounted,
                    setBodyMounted,
                    setHeaderMounted,
                  }}
                >
                  <FocusScope contain={trapFocus} restoreFocus autoFocus>
                    {childrenElements}
                  </FocusScope>
                </PopoverContext.Provider>
              </Popper>
            </PresenceTransition>
          </Overlay>
        </>
      )
    }
  )
) as any as PopoverI

PopoverMain.Arrow = PopoverArrow
PopoverMain.Content = PopoverContent

export const Popover = PopoverMain as PopoverI
