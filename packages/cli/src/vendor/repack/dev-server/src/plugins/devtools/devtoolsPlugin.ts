import path from 'path'

import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import open from 'open'

import type { Server } from '../../types'

async function devtoolsPlugin(
  instance: FastifyInstance,
  { options }: { options: Server.Options }
) {
  instance.route({
    method: ['GET', 'POST', 'PUT'],
    url: '/reload',
    handler: (_request, reply) => {
      instance.wss.messageServer.broadcast('reload')
      reply.send('OK')
    },
  })

  instance.route({
    method: ['GET', 'POST', 'PUT'],
    url: '/launch-js-devtools',
    handler: async (request, reply) => {
      const customDebugger = process.env.REACT_DEBUGGER
      if (customDebugger) {
        // NOOP for now
      } else if (!instance.wss.debuggerServer.isDebuggerConnected()) {
        const url = `${options.https ? 'https' : 'http'}://${
          options.host || 'localhost'
        }:${options.port}/debugger-ui`
        try {
          request.log.info({ msg: 'Opening debugger UI', url })
          await open(url)
        } catch (error) {
          if (error) {
            request.log.error({
              msg: 'Cannot open debugger UI',
              url,
              error,
            })
          }
        }
      }
      reply.send('OK')
    },
  })

  instance.route({
    method: ['GET', 'POST', 'PUT'],
    url: '/open-stack-frame',
    handler: async (request, reply) => {
      try {
        const { file, lineNumber, column } = JSON.parse(request.body as string) as {
          file: string
          lineNumber: number
          column?: number
        }
        const url = `${path.join(
          options.rootDir,
          // TODO: make it generic
          file.replace('webpack://', '')
        )}:${lineNumber}:${column ?? 1}`

        request.log.info({ msg: 'Opening stack frame in editor', url })

        const openEditor = (await import('open-editor')).default

        openEditor([url])
        reply.send('OK')
      } catch (error) {
        request.log.error({
          msg: 'Failed to open stack frame in editor',
          error: (error as Error).message,
        })
        reply.code(400).send()
      }
    },
  })

  instance.route({
    method: ['GET', 'POST', 'PUT'],
    url: '/open-url',
    handler: async (request, reply) => {
      try {
        const { url } = JSON.parse(request.body as string) as { url: string }
        request.log.info({ msg: 'Opening URL', url })
        await open(url)
        reply.send('OK')
      } catch (error) {
        request.log.error({ msg: 'Failed to open URL', error })
        reply.code(400).send()
      }
    },
  })

  // Silence this route
  instance.get('/inspector/device', { logLevel: 'silent' as any }, (_request, reply) => {
    reply.code(404).send()
  })
}

export default fastifyPlugin(devtoolsPlugin, {
  name: 'devtools-plugin',
  dependencies: ['wss-plugin'],
})
