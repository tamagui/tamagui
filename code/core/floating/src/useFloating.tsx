import React from 'react'

import * as Floating from './Floating'
import type { PopupTriggerMap } from './interactions/PopupTriggerMap'

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
  // extended by useFloatingContext for hoverable popovers/tooltips
  open?: boolean
  onHoverReference?: (event: any) => void
  onLeaveReference?: () => void
  triggerElements?: PopupTriggerMap
}

export type UseFloatingOverrideFn = (props?: UseFloatingProps) => UseFloatingReturn

export const FloatingOverrideContext = React.createContext<UseFloatingOverrideFn | null>(
  null
)

export const useFloating = (props: UseFloatingProps): UseFloatingReturn => {
  'use no memo'

  const context = React.useContext(FloatingOverrideContext)
  return (context || Floating.useFloating)?.({
    ...props,
    middleware: [
      // @ts-ignore
      ...props.middleware,
      {
        name: `rounded`,
        fn({ x, y }) {
          return {
            x: Math.round(x),
            y: Math.round(y),
          }
        },
      },
    ],
  })
}
