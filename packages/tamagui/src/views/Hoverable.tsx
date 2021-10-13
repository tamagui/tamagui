import { isWeb } from '@tamagui/core'
import React, { forwardRef } from 'react'

// bugfix esbuild strips react jsx: 'preserve'
React['keep']

type SpanProps = React.DOMAttributes<HTMLSpanElement>

export type HoverableProps = {
  children?: any
  onHoverIn?: SpanProps['onMouseEnter']
  onHoverOut?: SpanProps['onMouseLeave']
  onHoverMove?: SpanProps['onMouseMove']
  onPressIn?: SpanProps['onMouseDown']
  onPressOut?: SpanProps['onClick']
}

export const Hoverable = forwardRef(
  (
    { onPressIn, onPressOut, onHoverIn, onHoverOut, onHoverMove, children }: HoverableProps,
    ref
  ) => {
    if (!isWeb) {
      return children
    }
    return (
      <span
        ref={ref as any}
        style={{
          display: 'contents',
        }}
        onMouseEnter={onHoverIn}
        onMouseLeave={onHoverOut}
        onMouseMove={onHoverMove}
        onMouseDown={onPressIn}
        onClick={onPressOut}
      >
        {children}
      </span>
    )
  }
)
