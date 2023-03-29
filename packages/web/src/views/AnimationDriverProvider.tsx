import { AnimationDriverContext } from '../contexts/AnimationDriverContext'
import type { AnimationDriver } from '../types'

interface AnimationDriverProviderProps {
  driver: AnimationDriver | null
  children: React.ReactNode
}

// the public provider for users
export const AnimationDriverProvider = (props: AnimationDriverProviderProps) => {
  return (
    <AnimationDriverContext.Provider value={props.driver}>
      {props.children}
    </AnimationDriverContext.Provider>
  )
}
