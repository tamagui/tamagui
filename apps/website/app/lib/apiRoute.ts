import type { PostgrestError } from '@supabase/supabase-js'
import type { NextApiHandler } from 'next'

export class HandledResponseTermination extends Error {}

export function apiRoute(handler: NextApiHandler) {
  return (async (req, res) => {
    try {
      const result = handler(req, res)
      return result instanceof Promise ? await result : result
    } catch (err) {
      if (err instanceof HandledResponseTermination) {
        console.info(`Handled termination ${err.message}`)
        return
        // ok we handled it
      }
      const message = err instanceof Error ? err.message : `${err}`

      if (err instanceof Error) {
        console.error(`Error serving API Route: ${err.message} ${err.stack}`)
      }

      res.status(500).json({
        error: message,
      })

      throw err
    }
  }) satisfies NextApiHandler
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
