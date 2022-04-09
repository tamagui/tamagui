// forked from NativeBase
// The MIT License (MIT)
// Copyright (c) 2021 GeekyAnts India Pvt Ltd

import { useId } from '@react-aria/utils'
import { FocusScope } from '@react-native-aria/focus'
import { withStaticProperties } from '@tamagui/core'
import React, { forwardRef, memo, useCallback, useMemo } from 'react'
import { View } from 'react-native'

import { useControllableState } from '../../hooks/useControllableState'
import { Overlay } from '../Overlay'
import { Popper } from '../Popper'
import { PopoverContent } from './PopoverContent'
import { PopoverContext } from './PopoverContext'
import type { IPopoverProps } from './types'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

export const Popover = withStaticProperties(
  memo(
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
          prop: isOpenProp,
          defaultProp: defaultIsOpen || false,
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
          setIsOpen((x) => !x)
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

        const handleClose = useCallback(() => {
          setIsOpen(false)
        }, [])

        const childrenElements =
          typeof children === 'function' ? children({ open: isOpen }) : children

        const popoverContext = {
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
        }

        return (
          <>
            <View style={{ display: 'none' }} ref={ref}></View>
            {updatedTrigger()}
            <Overlay isOpen={isOpen} onRequestClose={handleClose} useRNModalOnAndroid>
              <Popper onClose={handleClose} triggerRef={triggerRef} {...props}>
                {/* <AbsoluteYStack
                  fullscreen
                  pointerEvents="auto"
                  backgroundColor="rgba(0,0,0,0.1)"
                  onPress={handleClose}
                /> */}
                <PopoverContext.Provider
                  value={useMemo(() => popoverContext, Object.values(popoverContext))}
                >
                  <FocusScope contain={trapFocus} restoreFocus autoFocus>
                    {childrenElements}
                  </FocusScope>
                </PopoverContext.Provider>
              </Popper>
            </Overlay>
          </>
        )
      }
    )
  ),
  {
    Arrow: Popper.Arrow,
    Content: PopoverContent,
  }
)
