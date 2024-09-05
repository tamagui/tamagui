import '@tamagui/polyfill-dev'

import * as React from 'react'

// this fixes various issues people run into (storybook, etc in discord)
// React doesn't really tree shake so not much danger here...
globalThis['React'] ||= React

// for SSR
if (typeof requestAnimationFrame === 'undefined') {
  globalThis['requestAnimationFrame'] = setImmediate
}
