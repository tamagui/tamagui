import { useEffect, useRef } from 'react'

import { useForceUpdate } from './useForceUpdate'
import { UseNodeSizeProps, useNodeSize } from './useNodeSize'

export function useParentNodeSize(props?: UseNodeSizeProps) {
  const ref = useRef<HTMLElement>(null)
  const update = useForceUpdate()
  const parentNodeRef = useRef<HTMLElement | null>(null)

  const sizer = useNodeSize({
    ref: parentNodeRef,
    ...props,
  })

  useEffect(() => {
    if (!ref.current) return
    let parent = ref.current.parentElement
    // avoid display contents nodes
    if (parent) {
      // @ts-ignore
      while (parent.computedStyleMap().get('display') === 'contents') {
        parent = parent.parentElement
        if (!parent) break
      }
    }
    parentNodeRef.current = parent
    update()
  }, [ref.current])

  return {
    ...sizer,
    ref,
  }
}
