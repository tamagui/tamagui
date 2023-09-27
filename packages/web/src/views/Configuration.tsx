import { ComponentContext } from '../contexts/ComponentContext'
import type { AnimationDriver } from '../types'

interface ConfigurationProps {
  animationDriver?: AnimationDriver | null
  children: React.ReactNode
}

export const Configuration = (props: ConfigurationProps) => {
  return <ComponentContext.Provider {...props} />
}
