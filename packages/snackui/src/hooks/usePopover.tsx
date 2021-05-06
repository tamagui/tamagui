import { fullyIdle, series } from '@dish/async'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { PopoverProps } from '../views/PopoverProps'
import { popoverCloseCbs } from '../views/PopoverShared'

export const usePopover = (props: PopoverProps) => {
  const isOpen = props.isOpen ?? false
  const onChangeOpenCb = useCallback(props.onChangeOpen as any, [props.onChangeOpen])
  const closeCb = useRef<Function | null>(null)
  const isControlled = typeof isOpen !== 'undefined'
  const [isMounted, setIsMounted] = useState(props.mountImmediately ?? false)
  const sendClose = () => closeCb.current?.()

  useEffect(() => {
    if (isMounted) {
      return
    }
    return series([fullyIdle, () => setIsMounted(true)])
  }, [])

  useLayoutEffect(() => {
    if (onChangeOpenCb) {
      popoverCloseCbs.add(onChangeOpenCb)
      return () => {
        popoverCloseCbs.delete(onChangeOpenCb!)
      }
    }
  }, [onChangeOpenCb])

  return { isOpen, isControlled, sendClose, isMounted, onChangeOpenCb }
}
