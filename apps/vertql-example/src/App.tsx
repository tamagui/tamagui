import { TamaguiProvider } from '@tamagui/core'
import { LogBox } from 'react-native'

import { GratsExampleApp } from './GratsExampleApp'
import { config } from './tamagui.config'

LogBox.ignoreAllLogs()

// import { App as ExpoRouterApp } from './ExpoRouterApp'
// export const App = ExpoRouterApp

export function App() {
  return (
    <TamaguiProvider config={config}>
      <GratsExampleApp />
    </TamaguiProvider>
  )
}
