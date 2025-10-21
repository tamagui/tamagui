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

  // Register listener only once per hostName
  useIsomorphicLayoutEffect(() => {
    if (!props.hostName) return

    const listener = (newNode: HTMLElement | null) => {
      setNode(newNode)
    }

    portalListeners[props.hostName] ||= new Set()
    portalListeners[props.hostName].add(listener)

    return () => {
      portalListeners[props.hostName!]?.delete(listener)
    }
  }, [props.hostName])

  // Sync with Map value in separate effect
  useIsomorphicLayoutEffect(() => {
    if (cur && cur !== node) {
      setNode(cur)
    }
  }, [cur, node])

  if (props.passThrough) {
    return props.children
  }

  // Check if node is connected before using it
  const actualNode = node?.isConnected ? node : null

  if (!actualNode) {
    return null
  }

  return createPortal(props.children, actualNode)
}
