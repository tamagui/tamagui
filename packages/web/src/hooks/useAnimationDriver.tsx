import { useContext } from 'react'

import { AnimationDriverContext } from '../contexts/AnimationDriverContext'
import { getAnimationDriver } from '../helpers/getAnimationDriver'
import { isRSC } from '@tamagui/constants'

export const useAnimationDriver = () => {
  if (isRSC) return getAnimationDriver()
  return useContext(AnimationDriverContext) ?? getAnimationDriver()
}
