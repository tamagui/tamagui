import { ComponentContext } from '../contexts/ComponentContext'
import type { AnimationDriver } from '../types'

interface AnimationDriverProviderProps {
  driver: AnimationDriver | null
  children: React.ReactNode
}

// the public provider for users
export const AnimationDriverProvider = (props: AnimationDriverProviderProps) => {
  return (
    <ComponentContext.Provider animationDriver={props.driver}>
      {props.children}
    </ComponentContext.Provider>
  )
}
