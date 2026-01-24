import type { ReactNode } from 'react'
import { getNativePortalState } from './portalState'

// types matching react-native-teleport's API
export type NativePortalProps = {
  hostName?: string
  children: ReactNode
}

export type NativePortalHostProps = {
  name: string
}

export type NativePortalProviderProps = {
  children: ReactNode
}

/**
 * Renders children into a teleport Portal when available.
 * Returns null when teleport is not set up (allows fallback handling by caller).
 */
export function NativePortal({
  hostName = 'root',
  children,
}: NativePortalProps): ReactNode {
  const state = getNativePortalState()
  if (state.type !== 'teleport') return null

  const { Portal } = (globalThis as any).__tamagui_teleport
  return <Portal hostName={hostName}>{children}</Portal>
}

/**
 * Renders a teleport PortalHost when available.
 * Returns null when teleport is not set up.
 */
export function NativePortalHost({ name }: NativePortalHostProps): ReactNode {
  const state = getNativePortalState()
  if (state.type !== 'teleport') return null

  const { PortalHost } = (globalThis as any).__tamagui_teleport
  return <PortalHost name={name} />
}

/**
 * Wraps children with teleport PortalProvider when available.
 * Returns children as-is when teleport is not set up.
 */
export function NativePortalProvider({ children }: NativePortalProviderProps): ReactNode {
  const state = getNativePortalState()
  if (state.type !== 'teleport') return <>{children}</>

  const { PortalProvider } = (globalThis as any).__tamagui_teleport
  return <PortalProvider>{children}</PortalProvider>
}
