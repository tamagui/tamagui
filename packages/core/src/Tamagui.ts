import { onConfiguredOnce } from './conf'
import { rnw } from './constants/rnw'
import { getAllSelectors } from './helpers/insertStyleRule'
import { TamaguiInternalConfig } from './types'

// serves a central store for state

class TamaguiManager {
  config: TamaguiInternalConfig | null = null
  rnw = rnw

  get allSelectors() {
    return getAllSelectors()
  }

  get identifierToValue() {
    return identifierToValue
  }
}

export const Tamagui = new TamaguiManager()

const identifierToValue = new Map<string, any>()

export const getValueFromIdentifier = (identifier: string) => {
  return identifierToValue.get(identifier)
}

export const setIdentifierValue = (identifier: string, value: any) => {
  identifierToValue.set(identifier, value)
}

onConfiguredOnce((conf) => {
  Tamagui.config = conf
})

if (!globalThis['Tamagui']) {
  globalThis['Tamagui'] = Tamagui
}
