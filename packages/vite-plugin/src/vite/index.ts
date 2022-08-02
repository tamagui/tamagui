import { TamaguiOptions } from '@tamagui/static'
import reactPlugin from '@vitejs/plugin-react'
import inspect from 'vite-plugin-inspect'

import { clientImportsPlugin } from '../framework/plugins/clientImportsPlugin'
import { clientMiddlewarePlugin } from '../framework/plugins/clientMiddlewarePlugin'
import { virtualFilesPlugin } from '../framework/plugins/virtualFilesPlugin'
import { middlewarePlugin } from './middlewarePlugin'
import rscPlugin from './rscPlugin'
import { tamaguiConfigPlugin } from './tamaguiConfigPlugin'

export const tamaguiPlugin = (options: TamaguiOptions) => {
  return [
    process.env.VITE_INSPECT && inspect(),
    clientMiddlewarePlugin(),
    clientImportsPlugin(),
    middlewarePlugin(options),
    virtualFilesPlugin(options),
    reactPlugin(),
    tamaguiConfigPlugin(options),
    rscPlugin(),
  ]
}
