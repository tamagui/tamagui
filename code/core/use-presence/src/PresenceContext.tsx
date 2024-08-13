import type { PresenceContextProps } from '@tamagui/web'
import * as React from 'react'

export const PresenceContext = React.createContext<PresenceContextProps | null>(null)

export const ResetPresence = (props: { children?: any }) => (
  <PresenceContext.Provider value={null}>{props.children}</PresenceContext.Provider>
)
