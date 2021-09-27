import React, { forwardRef } from 'react'

import { isWeb } from '../platform'

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
        className="see-through hoverable"
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
