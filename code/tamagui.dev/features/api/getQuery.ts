export const getQuery = (req: Request): Record<string, string | string[]> => {
  const searchParams = new URL(req.url).searchParams
  const out = {}
  searchParams.forEach((value, key) => {
    const all = searchParams.getAll(key)
    out[key] = all.length > 1 ? all : value
  })
  return out
}
