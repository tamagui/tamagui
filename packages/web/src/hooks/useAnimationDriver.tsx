import { useContext } from 'react'

import { AnimationDriverContext } from '../contexts/AnimationDriverContext'
import { getAnimationDriver } from '../helpers/getAnimationDriver'

export const useAnimationDriver = () => {
  return useContext(AnimationDriverContext) ?? getAnimationDriver()
}
