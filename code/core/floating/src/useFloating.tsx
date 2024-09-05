import React from 'react'

import * as Floating from './Floating'

export type UseFloatingFn = typeof Floating.useFloating

type InferFloatingProps = UseFloatingFn extends (props: infer Props) => any
  ? Props
  : never

export type UseFloatingProps = InferFloatingProps & {
  sameScrollView?: boolean
}

export type UseFloatingReturn = Floating.UseFloatingReturn & {
  context?: any
  getFloatingProps?: (props: { ref: any; [key: string]: any }) => any
  getReferenceProps?: (props: { ref: any; [key: string]: any }) => any
}

export const FloatingOverrideContext = React.createContext<UseFloatingFn | null>(null)

export const useFloating = (props: UseFloatingProps): UseFloatingReturn => {
  const context = React.useContext(FloatingOverrideContext)
  return (context || Floating.useFloating)?.(props)
}
