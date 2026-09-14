import { View as Frame } from '@fixture/ui'
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'

import { config } from './config'

export const Compiled = () =>
  _jsxs(Frame, {
    children: [
      _jsx(Frame, { padding: config.padding }),
      _jsx(Frame, { gap: config.gap }),
    ],
  })
