import { useEffect, useState } from 'react'
import { allPortalHosts, portalListeners } from './constants'
import type { PortalItemProps } from './types'
import { createPortal } from 'react-dom'

export const GorhomPortalItem = (props: PortalItemProps) => {
  if (!props.hostName && !props.passThrough) {
    console.warn(`No hostName`)
  }

  const cur = allPortalHosts.get(props.hostName || '')
  const [node, setNode] = useState(cur)

  if (!props.passThrough && cur && node !== cur) {
    setNode(cur)
  }

  useEffect(() => {
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
