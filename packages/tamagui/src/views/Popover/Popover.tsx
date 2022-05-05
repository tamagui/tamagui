// forked from NativeBase
// The MIT License (MIT)
// Copyright (c) 2021 GeekyAnts India Pvt Ltd

import { FocusScope } from '@react-native-aria/focus'
import { useId, withStaticProperties } from '@tamagui/core'
import { useControllableState } from '@tamagui/use-controllable-state'
import React, { forwardRef, memo, useCallback, useMemo } from 'react'
import { View } from 'react-native'

import { Overlay } from '../Overlay'
import { Popper } from '../Popper/Popper'
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
          open: openProp,
          children,
          defaultOpen,
          initialFocusRef,
          finalFocusRef,
          trapFocus = true,
          onChangeOpen,
          ...props
        }: IPopoverProps,
        ref: any
      ) => {
        const triggerRef = React.useRef(null)
        const [open, setOpen] = useControllableState({
          prop: openProp,
          defaultProp: defaultOpen || false,
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
          setOpen((x) => !x)
        }, [setOpen])

        const updatedTrigger = () => {
          return trigger(
            {
              ref: triggerRef,
              onPress: handleOpen,
              'aria-expanded': open ? true : false,
              'aria-controls': open ? popoverContentId : undefined,
              'aria-haspopup': true,
            },
            { open }
          )
        }

        const handleClose = useCallback(() => {
          setOpen(false)
        }, [])

        const childrenElements =
          typeof children === 'function' ? children({ open }) : open ? children : null

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
            <Overlay open={open} onRequestClose={handleClose} useRNModalOnAndroid>
              <Popper onClose={handleClose} triggerRef={triggerRef} {...props}>
                <PopoverContext.Provider
                  value={useMemo(() => popoverContext, Object.values(popoverContext))}
                >
                  {childrenElements ? (
                    <FocusScope contain={trapFocus} restoreFocus autoFocus>
                      {childrenElements}
                    </FocusScope>
                  ) : null}
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
