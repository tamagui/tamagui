// π🙂 proves that IR ranges use Yuku's exact UTF-16 source-string indices.
import { View as Frame } from '@fixture/ui'
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'

import { config } from './config'

const localProps = { gap: config.gap }
const overrideProps = { padding: config.gap }

export const ParityCompiled = () =>
  _jsxs(Frame, {
    padding: config.padding,
    ...localProps,
    ...overrideProps,
    children: [_jsx('span', { children: config.gap }), config.padding],
  })
