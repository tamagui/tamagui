import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

// the fixture publishes the zero graph's React so the island assertion can
// compare instances directly rather than inferring from bundle contents
;(globalThis as any).__zeroReact = React

createRoot(document.getElementById('root')!).render(<App />)
