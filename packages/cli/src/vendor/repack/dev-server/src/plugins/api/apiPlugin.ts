import type { FastifyInstance } from 'fastify'

import type { Server } from '../../types'

const paramsSchema = {
  type: 'object',
  properties: {
    platform: {
      type: 'string',
    },
  },
  required: ['platform'],
}

type Params = { platform: string }

async function apiPlugin(
  instance: FastifyInstance,
  { delegate }: { delegate: Server.Delegate }
) {
  instance.get('/platforms', async (_request, reply) =>
    delegate.api
      ? reply.send({ data: await delegate.api.getPlatforms() })
      : reply.notImplemented('Missing API delegate implementation')
  )

  instance.get<{ Params: Params }>(
    '/:platform/assets',
    { schema: { params: paramsSchema } },
    async (request, reply) =>
      delegate.api
        ? reply.send({
            data: await delegate.api.getAssets(request.params.platform),
          })
        : reply.notImplemented('Missing API delegate implementation')
  )

  instance.get<{ Params: Params }>(
    '/:platform/stats',
    { schema: { params: paramsSchema } },
    async (request, reply) =>
      delegate.api
        ? reply.send({
            data: await delegate.api?.getCompilationStats(request.params.platform),
          })
        : reply.notImplemented('Missing API delegate implementation')
  )
}

export default apiPlugin
