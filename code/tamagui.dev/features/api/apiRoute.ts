import type { PostgrestError } from '@supabase/supabase-js'
import type { Endpoint } from 'one'
import { isResponse } from 'one'
import { ClientError } from './ClientError'

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
      // a Response thrown by the handler is an intentional result, not an error
      if (isResponse(err)) {
        return err
      }

      // a ClientError is a user-facing message the caller is meant to see
      if (err instanceof ClientError) {
        return Response.json({ error: err.message }, { status: err.status })
      }

      // anything else is internal: log the detail server-side, return a generic
      // body so we don't leak Postgres/Stripe/internal messages to the client
      const message = err instanceof Error ? err.message : `${err}`
      console.trace(`Error in apiRoute ${req.url}: ${message}`, err)

      return Response.json({ error: 'Internal server error' }, { status: 500 })
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
