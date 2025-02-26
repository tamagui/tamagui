import { LogBox, UIManager } from 'react-native'
import App from './src'

LogBox.ignoreAllLogs()

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true)

export default App
