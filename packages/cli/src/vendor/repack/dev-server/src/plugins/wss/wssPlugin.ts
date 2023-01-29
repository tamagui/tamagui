import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import type { Server } from '../../types'
// import { HermesInspectorProxy } from './servers/HermesInspectorProxy'
import { WebSocketApiServer } from './servers/WebSocketApiServer'
import { WebSocketDebuggerServer } from './servers/WebSocketDebuggerServer'
import { WebSocketDevClientServer } from './servers/WebSocketDevClientServer'
import { WebSocketEventsServer } from './servers/WebSocketEventsServer'
import { WebSocketHMRServer } from './servers/WebSocketHMRServer'
import { WebSocketMessageServer } from './servers/WebSocketMessageServer'
import { WebSocketRouter } from './WebSocketRouter'

console.log('HermesInspectorProxy disabled')

declare module 'fastify' {
  interface FastifyInstance {
    wss: {
      debuggerServer: WebSocketDebuggerServer
      devClientServer: WebSocketDevClientServer
      messageServer: WebSocketMessageServer
      eventsServer: WebSocketEventsServer
      // hermesInspectorProxy: HermesInspectorProxy
      apiServer: WebSocketApiServer
      hmrServer: WebSocketHMRServer
      router: WebSocketRouter
    }
  }
}

async function wssPlugin(
  instance: FastifyInstance,
  {
    options,
    delegate,
  }: {
    options: Server.Options
    delegate: Server.Delegate
  }
) {
  const router = new WebSocketRouter(instance)

  console.log('setting up websocket')

  const debuggerServer = new WebSocketDebuggerServer(instance)
  const devClientServer = new WebSocketDevClientServer(instance)
  const messageServer = new WebSocketMessageServer(instance)
  const eventsServer = new WebSocketEventsServer(instance, {
    webSocketMessageServer: messageServer,
  })
  // const hermesInspectorProxy = new HermesInspectorProxy(instance, options)
  const apiServer = new WebSocketApiServer(instance)
  const hmrServer = new WebSocketHMRServer(instance, delegate.hmr)

  router.registerServer(debuggerServer)
  router.registerServer(devClientServer)
  router.registerServer(messageServer)
  router.registerServer(eventsServer)
  // router.registerServer(hermesInspectorProxy)
  router.registerServer(apiServer)
  router.registerServer(hmrServer)

  instance.decorate('wss', {
    debuggerServer,
    devClientServer,
    messageServer,
    eventsServer,
    // hermesInspectorProxy,
    apiServer,
    hmrServer,
    router,
  })
}

export default fastifyPlugin(wssPlugin, {
  name: 'wss-plugin',
})
