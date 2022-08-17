import { isBrowser } from './isBrowser.js'

/** The `isServer` utility is a function that returns a `boolean` indicating
 * if the code was run on the server.
 */

export function isServer() {
  return !isBrowser()
}
