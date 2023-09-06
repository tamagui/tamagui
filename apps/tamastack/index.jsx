import { AppRegistry, LogBox } from 'react-native'
import { App } from './src/App'

// import { ExpoRoot } from 'expo-router'

LogBox.uninstall()
// setTimeout(() => {
//   LogBox.install()
// })

// console.log('ExpoRoot', ExpoRoot)

AppRegistry.registerComponent('main', () => App)

LogBox.install()
