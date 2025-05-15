import { createContext } from 'react'

// stacks vertically through tree, based on nesting
export const ZIndexStackContext = createContext(1)

// if setting to overriden z index
export const ZIndexHardcodedContext = createContext<number | undefined>(undefined)
