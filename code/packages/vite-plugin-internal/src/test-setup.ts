import * as React from 'react'
import 'vitest-axe/extend-expect'

import { expect } from 'vitest'
// @ts-ignore
import * as matchers from 'vitest-axe/matchers'

expect.extend(matchers)

globalThis.React = React

// mock matchMedia for jsdom/happy-dom environments
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}
