import React, { useRef } from 'react'
import { useDisableScrollOutsideOf } from './useDisableScroll'

export type RemoveScrollProps = {
  enabled?: boolean
  children?: React.ReactNode
}

export const RemoveScroll = React.memo((props: RemoveScrollProps) => {
  const root = useRef<HTMLElement>(null)

  useDisableScrollOutsideOf(root, {
    enabled: Boolean(props.enabled),
  })

  return (
    <span ref={root} style={{ display: 'contents' }}>
      {props.children}
    </span>
  )
})
