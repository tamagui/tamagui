import type { ViteDevServer } from 'vite'

export type DevServerMessage =
  | {
      type: 'warn'
      data: string
    }
  | {
      type: 'error'
      data: { message: string; stack: string }
    }

export function sendMessageToClient(
  client: 'browser-console' | 'dev-tools' = 'browser-console',
  payload: DevServerMessage
) {
  // @ts-ignore
  const devServer = globalThis.__viteDevServer as ViteDevServer

  if (devServer) {
    devServer.ws.send({
      type: 'custom',
      event: `hydrogen-${client}`,
      data: payload,
    })
  }
}
