import { useEffect, useState } from 'react'
import { allPortalHosts, portalListeners } from './constants'
import type { PortalItemProps } from './types'
import { createPortal } from 'react-dom'

export const GorhomPortalItem = (props: PortalItemProps) => {
  if (!props.hostName) {
    throw new Error(`No name`)
  }

  const cur = allPortalHosts.get(props.hostName)
  const [node, setNode] = useState(cur)

  if (cur && !node) {
    setNode(cur)
  }

  useEffect(() => {
    if (!props.hostName) return
    if (node) return

    const listener = (node) => {
      setNode(node)
    }

    portalListeners[props.hostName] ||= new Set()
    portalListeners[props.hostName].add(listener)
    return () => {
      portalListeners[props.hostName!]?.delete(listener)
    }
  }, [node])

  if (!node) {
    return null
  }

  return createPortal(props.children, node)
}
