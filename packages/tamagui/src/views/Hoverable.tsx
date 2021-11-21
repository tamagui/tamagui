import { isWeb } from '@tamagui/core'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import { useDebounce } from '../hooks/useDebounce'

// bugfix esbuild strips react jsx: 'preserve'
React['keep']

type SpanProps = React.DOMAttributes<HTMLSpanElement>

export type HoverableProps = {
  children?: any
  disableUntilSettled?: boolean
  hoverDelay?: number
  onHoverIn?: () => void
  onHoverOut?: () => void
  onPressIn?: SpanProps['onMouseDown']
  onPressOut?: SpanProps['onClick']
}

export type HoverableHandle = {
  close: () => void
}

export const Hoverable = forwardRef<HoverableHandle, HoverableProps>(
  (
    {
      onPressIn,
      onPressOut,
      onHoverIn,
      onHoverOut,
      disableUntilSettled,
      hoverDelay = 0,
      children,
    }: HoverableProps,
    ref
  ) => {
    if (!isWeb) {
      return children
    }

    const [isActive, set] = useState(false)
    const setOffSlow = useDebounce(() => set(false), hoverDelay / 2) // math.min(a bit less than in)
    const setOnSlow = useDebounce(() => set(true), hoverDelay)
    const cancelAll = () => {
      setOnSlow.cancel()
      setOffSlow.cancel()
    }

    useImperativeHandle(ref, () => ({
      close: () => {
        set(false)
      },
    }))

    useEffect(() => {
      if (isActive) {
        onHoverIn?.()
      } else {
        onHoverOut?.()
      }
    }, [isActive])

    const setOff = () => {
      cancelAll()
      setOffSlow()
    }
    const setOn = () => {
      cancelAll()
      setOnSlow()
    }

    return (
      <span
        ref={ref as any}
        style={{
          display: 'contents',
        }}
        onMouseEnter={setOn}
        onMouseLeave={setOff}
        onMouseMove={disableUntilSettled ? setOn : undefined}
        onMouseDown={onPressIn}
        onClick={onPressOut}
      >
        {children}
      </span>
    )
  }
)
