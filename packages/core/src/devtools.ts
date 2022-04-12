import { onConfiguredOnce } from './conf'
import { rnw } from './constants/rnw'
import { getAllSelectors } from './helpers/insertStyleRule'

onConfiguredOnce((conf) => {
  if (globalThis['Tamagui']) {
    return
  }
  globalThis['Tamagui'] = {
    ...conf,
    rnw,
    get allSelectors() {
      return getAllSelectors()
    },
  }
})
