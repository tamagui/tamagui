import React, { type RefObject, useEffect, useRef } from 'react'
import { disableScroll } from './disableScroll'

export type RemoveScrollProps = {
  enabled?: boolean
  children?: React.ReactNode
}

export const RemoveScroll = React.memo((props: RemoveScrollProps) => {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }
    if (!props.enabled) {
      return
    }

    disableScroll.on()

    return () => {
      disableScroll.off()
    }
  }, [props.enabled])

  return (
    <span ref={root} style={{ display: 'contents' }}>
      {props.children}
    </span>
  )
})
