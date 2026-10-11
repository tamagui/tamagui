import { View as Frame } from '@fixture/ui'
import React from 'react'

import { config } from './config'

export const Created = () => React.createElement(Frame, { padding: config.padding })
