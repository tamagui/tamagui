import { TamaguiProvider } from '@tamagui/core'
import tamaConf from '../tamagui.config'

export const Providers = (props: { children: any }) => {
  return (
    <TamaguiProvider defaultTheme="light" config={tamaConf}>
      {props.children}
    </TamaguiProvider>
  )
}
