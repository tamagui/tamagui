import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import type { Server } from '../../types'
import { Symbolicator } from './Symbolicator'
import type { ReactNativeStackFrame } from './types'

async function symbolicatePlugin(
  instance: FastifyInstance,
  {
    delegate,
  }: {
    delegate: Server.Delegate
  }
) {
  const symbolicator = new Symbolicator(delegate.symbolicator)

  instance.post('/symbolicate', async (request, reply) => {
    // React Native sends stack as JSON but tests content-type to text/plain, so
    // we cannot use JSON schema to validate the body.

    try {
      const { stack } = JSON.parse(request.body as string) as {
        stack: ReactNativeStackFrame[]
      }
      const platform = Symbolicator.inferPlatformFromStack(stack)
      if (!platform) {
        request.log.debug({ msg: 'Received stack', stack })
        reply.badRequest('Cannot infer platform from stack trace')
      } else {
        request.log.debug({ msg: 'Starting symbolication', platform, stack })
        const results = await symbolicator.process(request.log, stack)
        reply.send(results)
      }
    } catch (error) {
      request.log.error({
        msg: 'Failed to symbolicate',
        error: (error as Error).message,
      })
      reply.internalServerError()
    }
  })
}

export default fastifyPlugin(symbolicatePlugin, {
  name: 'symbolicate-plugin',
  dependencies: ['fastify-sensible'],
})
