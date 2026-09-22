import { Appearance } from 'react-native'

export function setNativeColorScheme(scheme: 'light' | 'dark') {
  Appearance.setColorScheme(scheme)
}
