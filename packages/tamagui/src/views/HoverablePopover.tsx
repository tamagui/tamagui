// import { isTouchDevice } from '@tamagui/core'
import { useDebounce } from '@tamagui/use-debounce'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { Hoverable, HoverableHandle } from './Hoverable'
import { Popover } from './Popover/Popover'
import { IPopoverProps } from './Popover/types'

// import { Pressable } from 'react-native'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

export type HoverablePopoverHandle = {
  close: () => void
}

export type HoverablePopoverProps = IPopoverProps & {
  delay?: number
  // fallbackToPress?: boolean
  allowHoverOnContent?: boolean
  disableUntilSettled?: boolean
}

export const HoverablePopover = forwardRef<HoverablePopoverHandle, HoverablePopoverProps>(
  ({ trigger, delay = 0, children, allowHoverOnContent, disableUntilSettled, ...props }, ref) => {
    const hoverableRef = useRef<HoverableHandle>(null)
    const [isActive, set] = useState(false)

    // these are debounced only to allow jump betewen target/trigger
    // ..and to make content trigger faster than trigger
    // todo subtract from inner delay
    const setOffSlow = useDebounce(() => set(false), allowHoverOnContent ? 20 : 0)
    const setOnSlow = useDebounce(() => set(true), allowHoverOnContent ? 40 : 0)
    const cancelAll = () => {
      setOnSlow.cancel()
      setOffSlow.cancel()
    }

    const setOff = () => {
      cancelAll()
      setOffSlow()
    }
    const setOn = () => {
      cancelAll()
      setOnSlow()
    }

    useImperativeHandle(ref, () => ({
      close: () => {
        cancelAll()
        set(false)
        hoverableRef.current?.close()
      },
    }))

    // if (isTouchDevice && !fallbackToPress) {
    //   return trigger(null as any, { open: false })
    // }

    return (
      <Popover
        isOpen={isActive}
        {...props}
        trigger={(triggerProps, state) => {
          return (
            <Hoverable
              ref={hoverableRef}
              disableUntilSettled={disableUntilSettled}
              onHoverIn={setOn}
              onHoverOut={setOff}
              hoverDelay={delay}
            >
              {trigger(triggerProps, state)}
            </Hoverable>
          )
        }}
      >
        {(openProps) => {
          const childrenElements = typeof children === 'function' ? children(openProps) : children
          return (
            <Popover.Content>
              {allowHoverOnContent ? (
                <Hoverable onHoverIn={setOn} onHoverOut={setOff}>
                  {childrenElements}
                </Hoverable>
              ) : (
                childrenElements
              )}
            </Popover.Content>
          )
        }}
      </Popover>
    )
  }
)

// {isTouchDevice && fallbackToPress ? (
//   children
// ) : allowHoverOnContent ? (
//   <Hoverable onActive={setOn} onInactive={setOff}>
//     {children}
//   </Hoverable>
// ) : (
//   children
// )}

// const HoverOrToggle = (props: {
//   fallbackToPress?: boolean
//   onActive?: () => void
//   onInactive?: () => void
//   children?: any
// }) => {
//   return (
//     <Hoverable onHoverIn={onActive} onHoverOut={onInactive}>
//       {children}
//     </Hoverable>
//   )

//   // // TODO causes SSR issues
//   // if (isTouchDevice) {
//   //   const [isOn, setIsOn] = useState(false)
//   //   if (!fallbackToPress) {
//   //     return children
//   //   }
//   //   return (
//   //     <Pressable
//   //       onPress={() => {
//   //         setIsOn((x) => {
//   //           const next = !x
//   //           next ? onActive?.() : onInactive?.()
//   //           return next
//   //         })
//   //       }}
//   //     >
//   //       {children}
//   //     </Pressable>
//   //   )
//   // } else {
//   //   return (
//   //     <Hoverable onHoverIn={onActive} onHoverOut={onInactive}>
//   //       {children}
//   //     </Hoverable>
//   //   )
//   // }
// }
