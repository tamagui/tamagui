import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createSchema, createYoga } from 'graphql-yoga'
import { extractGratsSchemaAtRuntime } from 'grats'

import { Query } from './graph/user'

// extract the GraphQL schema.
const schema = extractGratsSchemaAtRuntime({
  emitSchemaFile: './schema.graphql',
})

const yogaSchema = createSchema({
  typeDefs: schema,
  resolvers: {
    Query: new Query(),
  },
})

export default (app: FastifyInstance) => {
  const yoga = createYoga<{
    req: FastifyRequest
    reply: FastifyReply
  }>({
    // @ts-ignore
    schema: yogaSchema,
    // Integrate Fastify logger
    logging: {
      debug: (...args) => args.forEach((arg) => app.log.debug(arg)),
      info: (...args) => args.forEach((arg) => app.log.info(arg)),
      warn: (...args) => args.forEach((arg) => app.log.warn(arg)),
      error: (...args) => args.forEach((arg) => app.log.error(arg)),
    },
  })

  app.route({
    // Bind to the Yoga's endpoint to avoid rendering on any path
    url: yoga.graphqlEndpoint,
    method: ['GET', 'POST', 'OPTIONS'],
    handler: async (req, reply) => {
      // Second parameter adds Fastify's `req` and `reply` to the GraphQL Context
      const response = await yoga.handleNodeRequest(req, {
        req,
        reply,
      })
      response.headers.forEach((value, key) => {
        reply.header(key, value)
      })
      reply.status(response.status)
      reply.send(response.body)
      return reply
    },
  })
}
