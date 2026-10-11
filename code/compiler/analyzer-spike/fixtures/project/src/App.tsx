import { View as Frame } from '@fixture/ui'

import { config } from './config'

export const App = () => <Frame padding={config.padding} gap={config.gap} />

export const shadowProof = (config = { padding: 99 }) => config.padding
