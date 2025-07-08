import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { allPortalHosts, portalListeners } from './constants'
import type { PortalItemProps } from './types'

export const GorhomPortalItem = (props: PortalItemProps) => {
  if (!props.hostName && !props.passThrough) {
    console.warn(`No hostName`)
  }

  const cur = allPortalHosts.get(props.hostName || '')
  const [node, setNode] = useState(cur)

  if (!props.passThrough && cur && node !== cur) {
    setNode(cur)
  }

  useIsomorphicLayoutEffect(() => {
    if (!props.hostName) return
    if (node) return

    const listener = (newNode: HTMLElement) => {
      setNode(newNode)
    }

    portalListeners[props.hostName] ||= new Set()
    portalListeners[props.hostName].add(listener)
    return () => {
      portalListeners[props.hostName!]?.delete(listener)
    }
  }, [node])

  if (props.passThrough) {
    return props.children
  }

  if (!node) {
    return null
  }

  return createPortal(props.children, node)
}
