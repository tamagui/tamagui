import React from 'react'
import { Platform } from 'react-native'

export function Hoverable({
  onPressIn,
  onPressOut,
  onHoverIn,
  onHoverOut,
  onHoverMove,
  children,
}: {
  children?: any
  onHoverIn?: any
  onHoverOut?: any
  onHoverMove?: any
  onPressIn?: any
  onPressOut?: any
}) {
  if (Platform.OS !== 'web') {
    return children
  }
  return (
    <span
      className="see-through"
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
