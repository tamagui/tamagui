/**
 * Not all environments have access to Performance.now(). This is to prevent
 * timing side channel attacks.
 *
 * See: https://community.cloudflare.com/t/cloudflare-workers-how-do-i-measure-execution-time-of-my-method/69672
 */
export function getTime() {
  if (typeof performance !== 'undefined' && performance.now) {
    return performance.now()
  } else {
    return Date.now()
  }
}
