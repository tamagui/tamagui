import './wdyr'

import { config } from '@tamagui/config-base'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppRegistry } from 'react-native'

import { Sandbox } from './Sandbox'

// AppRegistry.registerComponent('Main', () => Sandbox)
// console.log('config', config)

createRoot(document.querySelector('#root')!).render(<Sandbox />)
