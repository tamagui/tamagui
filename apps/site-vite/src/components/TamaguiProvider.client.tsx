import { TamaguiProvider as TP, TamaguiProviderProps } from 'tamagui'

import config from '../tamagui.config'

export function TamaguiProvider(props: Omit<TamaguiProviderProps, 'config'>) {
  return <TP config={config} {...props} />
}
