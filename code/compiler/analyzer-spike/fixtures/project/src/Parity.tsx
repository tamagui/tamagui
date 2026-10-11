// π🙂 proves that IR ranges use Yuku's exact UTF-16 source-string indices.
import { View as Frame } from '@fixture/ui'

import { config } from './config'

const localProps = { gap: config.gap }
const overrideProps = { padding: config.gap }

export const Parity = () => (
  <Frame padding={config.padding} {...localProps} {...overrideProps}>
    <span>{config.gap}</span>
    {config.padding}
  </Frame>
)
