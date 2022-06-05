import * as Helpers from '@tamagui/helpers'

import { getConfig } from './conf'
import { rnw } from './constants/rnw'
import { getAllSelectors, getAllTransforms, getInsertedRules } from './helpers/insertStyleRule'
import { TamaguiInternalConfig } from './types'

// serves a central store for state

class TamaguiManager {
  rnw = rnw
  Helpers = Helpers

  get config() {
    return getConfig()
  }

  get insertedRules() {
    return getInsertedRules()
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

export const Tamagui = new TamaguiManager()

const identifierToValue = new Map<string, any>()

export const getValueFromIdentifier = (identifier: string) => {
  return identifierToValue.get(identifier)
}

export const setIdentifierValue = (identifier: string, value: any) => {
  identifierToValue.set(identifier, value)
}

if (!globalThis['Tamagui']) {
  globalThis['Tamagui'] = Tamagui
}
