import { createReactClient } from '@gqty/react'
import type { QueryFetcher} from 'gqty';
import { Cache, GQtyError, createClient } from 'gqty'

import type { GeneratedSchema} from './schema.generated';
import { generatedSchema, scalarsEnumsHash } from './schema.generated'

const queryFetcher: QueryFetcher = async function (
  { query, variables, operationName },
  fetchOptions
) {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
      operationName,
    }),
    mode: 'cors',
    ...fetchOptions,
  })

  if (response.status >= 400) {
    throw new GQtyError(`GraphQL endpoint responded with HTTP status ${response.status}.`)
  }

  const text = await response.text()

  try {
    return JSON.parse(text)
  } catch {
    throw new GQtyError(
      `Malformed JSON response: ${text.length > 50 ? text.slice(0, 50) + '...' : text}`
    )
  }
}

const cache = new Cache(
  undefined,
  /**
   * Default option is immediate cache expiry but keep it for 5 minutes,
   * allowing soft refetches in background.
   */
  {
    maxAge: 0,
    staleWhileRevalidate: 5 * 60 * 1000,
    normalization: true,
  }
)

export const client = createClient<GeneratedSchema>({
  schema: generatedSchema,
  scalars: scalarsEnumsHash,
  cache,
  fetchOptions: {
    fetcher: queryFetcher,
  },
})

// Core functions
export const { resolve, subscribe, schema } = client

export const {
  graphql,
  useQuery,
  usePaginatedQuery,
  useTransactionQuery,
  useLazyQuery,
  useRefetch,
  useMutation,
  useMetaState,
  prepareReactRender,
  useHydrateCache,
  prepareQuery,
  useSubscription,
} = createReactClient<GeneratedSchema>(client, {
  defaults: {
    // Enable Suspense, you can override this option for each hook.
    suspense: true,
  },
})

export * from './schema.generated'
