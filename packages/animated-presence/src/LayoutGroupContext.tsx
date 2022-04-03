import { createContext } from 'react'

export interface LayoutGroupContextProps {
  id?: string
  forceRender?: VoidFunction
}

export const LayoutGroupContext = createContext<LayoutGroupContextProps>({})
