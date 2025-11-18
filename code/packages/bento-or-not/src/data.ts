/**
 * @tamagui/bento-or-not/data
 */

import { existsSync } from 'fs'
import { resolve } from 'path'

const BENTO_PATH = resolve(__dirname, '../../../../../bento')
const hasBento = existsSync(BENTO_PATH)

let bentoData: any = null

try {
  if (hasBento || (typeof process !== 'undefined' && process.env.CI)) {
    bentoData = require('@tamagui/bento/data')
  }
} catch (error) {
  // Bento not available
}

export const listingData = bentoData?.listingData ?? {
  sections: [],
  data: {},
}

export type * from './types'
