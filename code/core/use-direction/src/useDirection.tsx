// forked from https://github.com/radix-ui/primitives/blob/main/packages/react/direction/src/Direction.tsx

import * as React from 'react'

type Direction = 'ltr' | 'rtl'
const DirectionContext = React.createContext<Direction | undefined>(undefined)

interface DirectionProviderProps {
  children?: React.ReactNode
  dir: Direction
}

export const DirectionProvider: React.FC<DirectionProviderProps> = (props) => {
  const { dir, children } = props
  return <DirectionContext.Provider value={dir}>{children}</DirectionContext.Provider>
}

export function useDirection(localDir?: Direction) {
  const globalDir = React.useContext(DirectionContext)
  return localDir || globalDir || 'ltr'
}

export const Provider = DirectionProvider
