import { createContext } from 'react'

import { AnimationDriver } from '../types'

export const AnimationDriverContext = createContext<AnimationDriver | null>(null)
