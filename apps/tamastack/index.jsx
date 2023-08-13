import '@tamagui/vite-native-client'

import { AppRegistry, LogBox } from 'react-native'
import { App } from './src/App'

AppRegistry.registerComponent('main', () => App)

LogBox.install()

console.log('loading hmr client')
