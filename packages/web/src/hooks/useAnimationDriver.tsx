import { useContext } from 'react'

import { ComponentContext } from '../contexts/ComponentContext'
import { getAnimationDriver } from '../helpers/getAnimationDriver'

export const useAnimationDriver = () => {
  return useContext(ComponentContext).animationDriver ?? getAnimationDriver()
}
