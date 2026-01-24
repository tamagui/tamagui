import type { ReactNode } from 'react'

export type NativePortalState = {
  enabled: boolean
  type: 'teleport' | 'legacy' | null
}

export interface GestureState {
  enabled: boolean
  Gesture: any
  GestureDetector: any
  ScrollView: any
}

export interface WorkletsState {
  enabled: boolean
  Worklets: any
  useRunOnJS: any
  useWorklet: any
  createWorkletContextValue: any
}

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
