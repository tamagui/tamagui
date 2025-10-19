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
  const [node, setNode] = useState<HTMLElement | null | undefined>(cur)

  // Check if current node is disconnected and clear it immediately
  const actualNode = node?.isConnected ? node : null

  if (!props.passThrough && cur && actualNode !== cur) {
    setNode(cur)
  }

  useIsomorphicLayoutEffect(() => {
    if (!props.hostName) return

    // Check if current node is still in the document
    if (node && !node.isConnected) {
      setNode(null)
      return
    }

    if (actualNode) return

    // If we already have cur from Map, use it immediately
    if (cur) {
      setNode(cur)
      return
    }

    const listener = (newNode: HTMLElement) => {
      setNode(newNode)
    }

    portalListeners[props.hostName] ||= new Set()
    portalListeners[props.hostName].add(listener)
    return () => {
      portalListeners[props.hostName!]?.delete(listener)
    }
  }, [node, actualNode, cur, props.hostName])

  if (props.passThrough) {
    return props.children
  }

  if (!actualNode) {
    return null
  }

  return createPortal(props.children, actualNode)
}
