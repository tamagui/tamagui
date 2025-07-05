import type { PresenceContextProps } from '@tamagui/web'
import * as React from 'react'

export const PresenceContext: React.Context<PresenceContextProps | null> =
  React.createContext<PresenceContextProps | null>(null)

export const ResetPresence = (props: {
  children?: React.ReactNode
  disable?: boolean
}): React.ReactNode => {
  const parent = React.useContext(PresenceContext)
  return (
    <PresenceContext.Provider value={props.disable ? parent : null}>
      {props.children}
    </PresenceContext.Provider>
  )
}
