// import './wdyr'

import { createRoot } from 'react-dom/client'

// needed for reanimated
// @ts-ignore
globalThis['setImmediate'] =
  typeof setImmediate === 'function' ? setImmediate : setTimeout

import('./Sandbox').then(({ Sandbox }) => {
  createRoot(document.querySelector('#root')!).render(<Sandbox />)
})

// AppRegistry.registerComponent('Main', () => Sandbox)
// console.log('config', config)
