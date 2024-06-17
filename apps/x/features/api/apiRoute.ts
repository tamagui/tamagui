import type { PostgrestError } from '@supabase/supabase-js'
import type { Endpoint } from 'vxs'

export function apiRoute(handler: Endpoint) {
  return (async (req) => {
    try {
      const result = handler(req)
      const out = result instanceof Promise ? await result : result

      return out
    } catch (err) {
      if (err instanceof Response) {
        console.error(
          ` Error in apiRoute (caught response) ${req.url}:
            ${err.status} ${err.statusText}\n`
        )
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
