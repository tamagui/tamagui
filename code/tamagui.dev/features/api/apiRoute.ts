import type { PostgrestError } from '@supabase/supabase-js'
import type { Endpoint } from 'one'
import { isResponse } from 'one'

export function apiRoute(handler: Endpoint) {
  return (async (req) => {
    try {
      const result = handler(req)
      const out = result instanceof Promise ? await result : result

      if (isResponse(out) && (out.status < 200 || out.status >= 400) && out.body) {
        try {
          console.info(`Error Response (${out.status}) from ${req.url}:`)
        } catch {
          // ignore log errors
        }
      }

      return out
    } catch (err) {
      // not an error
      if (isResponse(err)) {
        return err
      }

      const message = err instanceof Error ? err.message : `${err}`

      // log errors with traces for debugging in prod
      console.trace(`Error in apiRoute (caught response) ${req.url}: ${message}`, err)

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
