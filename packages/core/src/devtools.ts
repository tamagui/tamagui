import { onConfiguredOnce } from './conf'
import { insertedSelectors } from './helpers/insertStyleRule'

onConfiguredOnce((conf) => {
  if (globalThis['Tamagui']) {
    return
  }
  globalThis['Tamagui'] = {
    ...conf,
    get insertedCSS() {
      return insertedSelectors
    },
  }
})
