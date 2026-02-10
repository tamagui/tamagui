// setup native features - just import, no function calls needed
import '@tamagui/native/setup-zeego'
import '@tamagui/native/setup-teleport'
import '@tamagui/native/setup-gesture-handler'
// import '@tamagui/native/setup-safe-area'
import '@tamagui/native/setup-keyboard-controller'
import '@tamagui/native/setup-burnt'

import { registerRootComponent } from 'expo'

const App = require('./src/App').default

registerRootComponent(() => <App />)
