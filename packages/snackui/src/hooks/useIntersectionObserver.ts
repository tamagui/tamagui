import { RefObject, useLayoutEffect, useRef, useState } from 'react'

import { useGet } from './useGet'

export function useIntersectionObserver(
  props: {
    ref: RefObject<HTMLElement>
    onChange?: IntersectionObserverCallback
    options?: IntersectionObserverInit
    disable?: boolean
  },
  mountArgs?: any[]
) {
  const { ref, options, disable } = props
  const getOnChange = useGet(props.onChange)
  const dispose = useRef<any>(null)
  const [state, setState] = useState<IntersectionObserverEntry[] | null>(null)

  useLayoutEffect(() => {
    if (disable) return
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver((...args) => {
      if (getOnChange()) {
        getOnChange()?.(...args)
      } else {
        const [entries] = args
        setState(entries)
      }
    }, options)
    observer.observe(node)
    dispose.current = () => {
      observer.disconnect()
    }
    return dispose.current
  }, [ref.current, disable, JSON.stringify(options), ...(mountArgs || [])])

  if (!props.onChange) {
    return state
  }
}
