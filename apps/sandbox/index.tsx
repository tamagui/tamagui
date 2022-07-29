// import './wdyr'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppRegistry } from 'react-native'

import { Sandbox } from './Sandbox'

AppRegistry.registerComponent('Main', () => Sandbox)

createRoot(document.querySelector('#root')!).render(<Sandbox />)
