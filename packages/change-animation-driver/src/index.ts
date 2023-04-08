import { TamaguiInternalConfig, getConfig } from '@tamagui/web'
// import type { CreateTamaguiProps } from '@tamagui/web'
import { configListeners, setConfig } from '@tamagui/web'
import { setAnimations } from '@tamagui/web'

export function changeAnimationDriver(animations: TamaguiInternalConfig['animations']) {
  if (process.env.NODE_ENV === 'development') {
    if (!animations.animations) throw new Error('animations is required')
  }

  const config = getConfig()
  config['animations'].animations = animations.animations!
  setAnimations(animations.animations!)
}
