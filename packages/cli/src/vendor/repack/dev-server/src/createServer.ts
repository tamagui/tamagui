import { Writable } from 'stream'

// import debuggerAppPath from '@callstack/repack-debugger-app'
import fastifySensible from '@fastify/sensible'
import fastifyStatic from '@fastify/static'
import Fastify from 'fastify'

import apiPlugin from './plugins/api'
import compilerPlugin from './plugins/compiler'
import devtoolsPlugin from './plugins/devtools'
// import faviconPlugin from './plugins/favicon'
import multipartPlugin from './plugins/multipart'
import symbolicatePlugin from './plugins/symbolicate'
import wssPlugin from './plugins/wss'
import { Internal, Server } from './types'

/**
 * Create instance of development server, powered by Fastify.
 *
 * @param config Server configuration.
 * @returns `start` and `stop` functions as well as an underlying Fastify `instance`.
 */
export async function createServer(config: Server.Config) {
  let delegate: Server.Delegate

  /** Fastify instance powering the development server. */
  const instance = Fastify({
    logger: {
      level: 'trace',
      stream: new Writable({
        write: (chunk, _encoding, callback) => {
          const log = JSON.parse(chunk.toString())
          delegate?.logger.onMessage(log)
          instance.wss?.apiServer.send(log)
          callback()
        },
      }),
    },
    ...(config.options.https ? { https: config.options.https } : undefined),
  })

  delegate = config.delegate({
    log: instance.log,
    notifyBuildStart: (platform) => {
      instance.wss.apiServer.send({
        event: Internal.EventTypes.BuildStart,
        platform,
      })
    },
    notifyBuildEnd: (platform) => {
      instance.wss.apiServer.send({
        event: Internal.EventTypes.BuildEnd,
        platform,
      })
    },
    broadcastToHmrClients: (event, platform, clientIds) => {
      instance.wss.hmrServer.send(event, platform, clientIds)
    },
    broadcastToMessageClients: ({ method, params }) => {
      instance.wss.messageServer.broadcast(method, params)
    },
  })

  // Register plugins
  await instance.register(fastifySensible)
  await instance.register(wssPlugin, {
    options: config.options,
    delegate,
  })
  await instance.register(multipartPlugin)
  await instance.register(apiPlugin, {
    delegate,
    prefix: '/api',
  })
  await instance.register(compilerPlugin, {
    delegate,
  })
  await instance.register(symbolicatePlugin, {
    delegate,
  })
  await instance.register(devtoolsPlugin, {
    options: config.options,
  })

  console.warn('disable debugger-ui + favicon for now')
  // await instance.register(fastifyStatic, {
  //   root: debuggerAppPath,
  //   prefix: '/debugger-ui',
  //   prefixAvoidTrailingSlash: true,
  // })

  // below is to prevent showing `GET 400 /favicon.ico`
  // errors in console when requesting the bundle via browser
  // await instance.register(faviconPlugin)

  instance.addHook('onSend', async (request, reply, payload) => {
    reply.header('X-Content-Type-Options', 'nosniff')

    const [pathname] = request.url.split('?')
    if (pathname.endsWith('.map')) {
      reply.header('Access-Control-Allow-Origin', 'devtools://devtools')
    }

    return payload
  })

  // Register routes
  instance.head('/', async () => '')
  instance.get('/', async () => delegate.messages.getHello())
  instance.get('/status', async () => delegate.messages.getStatus())

  /** Start the development server. */
  async function start() {
    await instance.listen(config.options.port, config.options.host)
  }

  /** Stop the development server. */
  async function stop() {
    await instance.close()
  }

  return {
    start,
    stop,
    instance,
  }
}
