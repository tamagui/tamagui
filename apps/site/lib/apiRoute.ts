import { NextApiHandler } from 'next'

export class HandledResponseTermination extends Error {}

export function apiRoute(handler: NextApiHandler) {
  return (async (req, res) => {
    try {
      const result = handler(req, res)
      return result instanceof Promise ? await result : result
    } catch (err) {
      if (err instanceof HandledResponseTermination) {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log(`Handled termination ${err.message}`)
        return
        // ok we handled it
      } else {
        throw err
      }
    }
  }) satisfies NextApiHandler
}
