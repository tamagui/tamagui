import { useContext } from 'react'

import { AnimationDriverContext } from '../contexts/AnimationDriverContext.js'
import { getAnimationDriver } from '../helpers/getAnimationDriver.js'

export const useAnimationDriver = () => {
  return useContext(AnimationDriverContext) ?? getAnimationDriver()
}
