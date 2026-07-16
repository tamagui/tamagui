import { createRoot, hydrateRoot } from 'react-dom/client'

import { Root } from './Root'

const container = document.querySelector('#root')!

if (container.hasChildNodes()) {
  hydrateRoot(container, <Root />)
} else {
  createRoot(container).render(<Root />)
}
