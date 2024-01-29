import type { Express } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { extractGratsSchemaAtRuntime } from 'grats'

// extract the GraphQL schema.
const schema = extractGratsSchemaAtRuntime({
  emitSchemaFile: './schema.graphql',
})

export default (app: Express) => {
  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      rootValue: {
        User: {
          hello: () => `hi`,
        },
      },
      graphiql: true,
    })
  )
}
