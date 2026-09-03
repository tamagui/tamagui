/**
 * Builds a theme set on first property access instead of on import.
 *
 * `createV5Theme()` produces 780 themes of 237 tokens each. Importing anything
 * from `v5-themes` or `v5-themes-subtle` used to pay for the whole default set,
 * even for an app that calls `createV5Theme` itself and never reads the default
 * one - which is what every app with its own palette does. Measured on a Hermes
 * desktop bundle, the two default sets cost 65ms of startup between them,
 * roughly 28% of all module evaluation, and both were discarded unread.
 *
 * The result is memoized, so an app that DOES use the defaults pays exactly what
 * it paid before, at `createTamagui` time rather than at import time.
 */
export function lazyThemes<Themes extends object>(build: () => Themes): Themes {
  let built: Themes | undefined
  const get = () => (built ||= build())
  return new Proxy({} as Themes, {
    get: (_target, key) => get()[key as keyof Themes],
    has: (_target, key) => key in get(),
    ownKeys: () => Reflect.ownKeys(get()),
    // the proxy target stays empty, so every key has to be reported as
    // configurable or the ownKeys invariant throws on Object.keys()
    getOwnPropertyDescriptor: (_target, key) => {
      const descriptor = Object.getOwnPropertyDescriptor(get(), key)
      return descriptor && { ...descriptor, configurable: true }
    },
  })
}
