import { registerRootComponent } from 'expo'
import React from 'react'

import App from './src/App'

globalThis['React'] = React

registerRootComponent(App)
