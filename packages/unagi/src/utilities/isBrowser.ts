/** The `isClient` utility is a function that returns a boolean indicating
 * if the code was run in the browser.
 */

export function isBrowser() {
  return typeof document !== 'undefined'
}
