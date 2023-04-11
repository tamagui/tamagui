import { useContext } from 'react'

import { AnimationDriverContext } from '../contexts/AnimationDriverContext.js'
import { getAnimationDriver } from '../helpers/getAnimationDriver.js'
import { isRSC } from '@tamagui/constants'

export const useAnimationDriver = () => {
  if (isRSC) return getAnimationDriver()
  return useContext(AnimationDriverContext) ?? getAnimationDriver()
}
