import { Appearance } from 'react-native'
import { getRootThemeState } from './useThemeState'

export function doesRootSchemeMatchSystem() {
  // only used on native for now
  return getRootThemeState()?.scheme === Appearance.getColorScheme()
}
