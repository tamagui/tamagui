import { getConfig } from '@tamagui/web'
import type { CreateTamaguiProps } from '@tamagui/web'
import { configListeners, setConfig } from '@tamagui/web/types/config'

export function changeAnimationDriver(props: {
  animations: CreateTamaguiProps['animations']
}) {
  const config = getConfig()
  config['animations'] = props.animations!

  // TODO: are these lines needed?
  setConfig(config)
  if (configListeners.size) {
    configListeners.forEach((cb) => cb(config))
    configListeners.clear()
  }
}
