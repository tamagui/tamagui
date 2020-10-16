import { EffectCallback, RefObject, useEffect, useRef } from 'react'

import { useGet } from './useGet'

export function useMutationObserver<T extends RefObject<HTMLElement>>(
  props: {
    ref: T
    options: MutationObserverInit
    onChange: (node: T['current']) => any
    disable?: boolean
  },
  mountArgs?: any[]
) {
  const { ref, options, onChange, disable } = props
  const node = ref.current
  const dispose = useRef<EffectCallback | null>(null)
  const getOnChange = useGet(onChange)

  useEffect(() => {
    if (disable) return
    if (!node) return
    let mutationObserver = new MutationObserver(() => {
      getOnChange()(node)
    })
    mutationObserver.observe(node, options)
    dispose.current = () => {
      mutationObserver.disconnect()
    }

    return () => {
      dispose.current?.()
    }
  }, [node, disable, JSON.stringify(options), ...(mountArgs || [])])
}
