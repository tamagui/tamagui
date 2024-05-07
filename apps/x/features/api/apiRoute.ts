import type { Endpoint } from '@vxrn/router'
import type { PostgrestError } from '@supabase/supabase-js'

export function apiRoute(handler: Endpoint) {
  return (async (req) => {
    try {
      const result = handler(req)
      return result instanceof Promise ? await result : result
    } catch (err) {
      if (err instanceof Response) {
        return err
      }

      const message = err instanceof Error ? err.message : `${err}`

      if (err instanceof Error) {
        console.error(`Error serving API Route: ${err.message} ${err.stack}`)
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
