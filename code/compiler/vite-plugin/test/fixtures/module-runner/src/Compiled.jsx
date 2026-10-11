import { FixtureFrame } from '@fixture/components'
import { jsx } from 'react/jsx-runtime'

export const Compiled = () =>
  jsx(FixtureFrame, { padding: 'sm:7px', 'data-compiled': 'yes' })
