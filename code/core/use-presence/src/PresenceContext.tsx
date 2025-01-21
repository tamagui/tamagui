import type { PresenceContextProps } from '@tamagui/web'
import * as React from 'react'

export const PresenceContext: React.Context<PresenceContextProps | null> =
  React.createContext<PresenceContextProps | null>(null)

export const ResetPresence = (props: { children?: any }): JSX.Element => (
  <PresenceContext.Provider value={null}>{props.children}</PresenceContext.Provider>
)
