import { Key, TokensToRegexpOptions, pathToRegexp } from 'path-to-regexp'

// Modified from React Router v5
// https://github.com/remix-run/react-router/blob/v5/packages/react-router/modules/matchPath.js

const cache: any = {}
const cacheLimit = 10000
let cacheCount = 0

interface MatchPathOptions extends TokensToRegexpOptions {
  path?: string
  exact?: boolean
}

function compilePath(
  path: string,
  options: MatchPathOptions
): { regexp: RegExp; keys: Array<Key> } {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {})

  if (pathCache[path]) return pathCache[path]

  const keys: Array<Key> = []
  const regexp = pathToRegexp(path, keys, options)
  const result = { regexp, keys }

  if (cacheCount < cacheLimit) {
    pathCache[path] = result
    cacheCount++
  }

  return result
}

/**
 * Public API for matching a URL pathname to a path.
 */
export function matchPath(pathname: string, options: MatchPathOptions = {}) {
  const { path, exact = false, strict = false, sensitive = false } = options

  const paths: Array<any> = [].concat(path as any)

  return paths.reduce((matched, path) => {
    if (!path && path !== '') return null
    if (matched) return matched

    const { regexp, keys } = compilePath(path, {
      end: exact,
      strict,
      sensitive,
    })
    const match = regexp.exec(pathname)

    if (!match) return null

    const [url, ...values] = match
    const isExact = pathname === url

    if (exact && !isExact) return null

    return {
      path, // the path used to match
      url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
      isExact, // whether or not we matched exactly
      params: keys.reduce((memo: any, key, index) => {
        memo[key.name] = values[index]
        return memo
      }, {}),
    }
  }, null)
}
