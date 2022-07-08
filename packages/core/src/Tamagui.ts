import * as Helpers from '@tamagui/helpers'
import * as rnw from '@tamagui/rnw'

import { getConfig } from './conf'
import { getAllSelectors, getAllTransforms, getInsertedRules } from './helpers/insertStyleRule'

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
