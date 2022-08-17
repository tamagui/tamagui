// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace globalThis {
  let __cache: Cache | undefined
}

export function setCache(cache?: Cache) {
  globalThis.__cache = cache
}

export function getCache(): Cache | undefined {
  return globalThis.__cache
}
