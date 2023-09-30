import '@tamagui/polyfill-dev'

import * as React from 'react'

globalThis.React = React

// for SSR
if (typeof requestAnimationFrame === 'undefined') {
  globalThis['requestAnimationFrame'] = setImmediate
}

const cancelAnimationFrame = globalThis.cancelAnimationFrame

// for vite / Animated.spring()
if (typeof globalThis === 'undefined') {
  console.warn(
    `Warning: globalThis is undefined, are you overwriting it in your bundler?`
  )
} else {
  globalThis.cancelAnimationFrame = (x: number) => {
    try {
      cancelAnimationFrame(x)
    } catch {
      // illegal invocation :/
    }
  }
}

// need to export something, afraid of tree shaking even with `sideEffects`
export const idFn = () => {}
