import { InlineConfig, createServer } from 'vite'

import { isVite3 } from '../utilities/vite.js'

export async function viteception(paths: string[], options?: InlineConfig) {
  const isWorker = process.env.WORKER
  delete process.env.WORKER

  const server = await createServer({
    clearScreen: false,
    server: {
      middlewareMode: isVite3 ? true : 'ssr',
      hmr: false,
    },
    // @ts-ignore
    appType: 'custom',
    ...options,
  })

  if (isWorker) {
    process.env.WORKER = isWorker
  }

  const loaded = await Promise.all(paths.map((path) => server.ssrLoadModule(path)))

  await server.close()

  return { server, loaded }
}
