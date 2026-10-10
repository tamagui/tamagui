import '@tamagui/core/reset.css'

import { createRoot, hydrateRoot } from 'react-dom/client'

import { CanaryTree } from './CanaryTree'

const container = document.querySelector('#root')

if (!container) {
  throw new Error('Missing #root for the v3 canary')
}

if (container.hasChildNodes()) {
  hydrateRoot(container, <CanaryTree />)
} else {
  createRoot(container).render(<CanaryTree />)
}
