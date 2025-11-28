import type { ReactNode } from 'react'

export type CreatePortalFn = (children: ReactNode, container: number) => ReactNode

let customCreatePortal: CreatePortalFn | null = null

export function setupPortal(options: { createPortal: CreatePortalFn }) {
  customCreatePortal = options.createPortal
}

export function getCreatePortal(): CreatePortalFn | null {
  return customCreatePortal
}
