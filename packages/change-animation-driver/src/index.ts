import { getConfig } from '@tamagui/web'
// import type { CreateTamaguiProps } from '@tamagui/web'
import { configListeners, setConfig } from '@tamagui/web'

export function changeAnimationDriver(animations: any) {
  const config = getConfig()
  config['animations'].animations = animations.animations!
}
