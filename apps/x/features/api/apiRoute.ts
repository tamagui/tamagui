import type { PostgrestError } from '@supabase/supabase-js'
import type { Endpoint } from 'vxs'

export function apiRoute(handler: Endpoint) {
  return (async (req) => {
    try {
      const result = handler(req)
      const out = result instanceof Promise ? await result : result
      return out
    } catch (err) {
      const message = err instanceof Error ? err.message : `${err}`

      // log errors with traces for debugging in prod
      console.trace(`Error in apiRoute (caught response) ${req.url}: ${message}`)

      if (err instanceof Response) {
        return err
      }

      return new Response(
        JSON.stringify({
          error: message,
        }),
        {
          status: 500,
          headers: {
            'content-type': 'application/json',
          },
        }
      )
    }
  }) satisfies Endpoint
}

export function postgresError(err: PostgrestError): Error {
  return new Error(`Postgres query error: [${err.code}]:
  message:
${err.message}
  details:
${err.details}
  hint:
${err.hint}
`)
}
