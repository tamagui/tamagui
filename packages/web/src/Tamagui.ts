import * as Helpers from '@tamagui/helpers'

import { getConfig } from './config'
import { getAllRules, getAllSelectors, getAllTransforms } from './helpers/insertStyleRule'
import { mediaState } from './hooks/useMedia'
import { activeThemeManagers, getThemeManager } from './hooks/useTheme'

// easy introspection
// only included in dev mode

export const Tamagui = (() => {
  if (process.env.NODE_ENV === 'development') {
    class TamaguiManager {
      Helpers = Helpers
      getThemeManager = getThemeManager

      get activeThemeManagers() {
        return activeThemeManagers
      }

      get mediaState() {
        return { ...mediaState }
      }

      get config() {
        return getConfig()
      }

      get insertedRules() {
        return getAllRules()
      }

      get allSelectors() {
        return getAllSelectors()
      }

      get allTransforms() {
        return getAllTransforms()
      }

      get identifierToValue() {
        return identifierToValue
      }
    }
    return new TamaguiManager()
  }
})()

const identifierToValue = new Map<string, any>()

export const getValueFromIdentifier = (identifier: string) => {
  return identifierToValue.get(identifier)
}

export const setIdentifierValue = (identifier: string, value: any) => {
  identifierToValue.set(identifier, value)
}
