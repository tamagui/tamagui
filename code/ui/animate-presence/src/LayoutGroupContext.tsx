import React from 'react'

export interface LayoutGroupContextProps {
  id?: string
  forceRender?: VoidFunction
}

export const LayoutGroupContext = React.createContext<LayoutGroupContextProps>({})
