// π🙂 proves that IR ranges use Yuku's exact UTF-16 source-string indices.
import { createElement as h } from 'react'

import { View as Frame } from '@fixture/ui'

import { config } from './config'

const localProps = { gap: config.gap }
const overrideProps = { padding: config.gap }

export const ParityCreated = () =>
  h(
    Frame,
    { padding: config.padding, ...localProps, ...overrideProps },
    h('span', null, config.gap),
    config.padding
  )
