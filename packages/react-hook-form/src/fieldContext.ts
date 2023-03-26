import { createContext, useContext } from 'react'

export interface FieldContext {
  name: string;
}

export const fieldContext = createContext<FieldContext>({} as FieldContext)

export const useField = () => useContext(fieldContext)
