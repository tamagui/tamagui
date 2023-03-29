import { useContext } from 'react'

import { AnimationDriverContext } from '../contexts/AnimationDriverContext'

export const useAnimationDriver = () => {
  return useContext(AnimationDriverContext)
}
