// import './wdyr'

import { createRoot } from 'react-dom/client'

import { Sandbox } from './Sandbox'

// AppRegistry.registerComponent('Main', () => Sandbox)
// console.log('config', config)

createRoot(document.querySelector('#root')!).render(<Sandbox />)
