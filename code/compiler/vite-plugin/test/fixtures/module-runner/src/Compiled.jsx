import { FixtureFrame } from '@fixture/components'
import { jsx } from 'react/jsx-runtime'

export const Compiled = () =>
  jsx(FixtureFrame, { $sm: { padding: 7 }, 'data-compiled': 'yes' })
