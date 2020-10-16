import { EffectCallback, RefObject, useEffect, useRef } from 'react'

import { useGet } from './useGet'

export function useResizeObserver(
  props: {
    ref: RefObject<HTMLElement | null>
    onChange: any
    disable?: boolean
  },
  mountArgs?: any[]
): Function {
  const { ref, disable } = props
  const onChange = useGet(props.onChange)
  const dispose = useRef<EffectCallback | null>(null)

  useEffect(() => {
    if (disable) return
    if (!ref || !ref.current) return
    // @ts-ignore
    let resizeObserver = new ResizeObserver((...args) => {
      onChange()(...args)
    })
    resizeObserver.observe(ref.current)
    dispose.current = () => {
      resizeObserver.disconnect()
    }
    return () => {
      dispose.current?.()
    }
  }, [ref, disable, ...(mountArgs || [])])

  return () => dispose.current?.()
}
