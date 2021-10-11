export type PropMapper = (
  key: string,
  value: any,
  props: { [key: string]: any }
) => boolean | [string, any][] | undefined | null

export const propMapReducer = <A>(mapper: PropMapper, props: A): Partial<A> => {
  const additional = {}
  for (const key in props) {
    const out = mapper(key, props[key], props)
    if (out && out !== true) {
      for (const [key, val] of out) {
        additional[key] = val
      }
    }
  }
  return additional
}

// only use last one??? seems reasonable
export const combinePropMappers = (...mappers: PropMapper[]) => {
  const reversed = [...mappers].reverse()
  const combined: PropMapper = (k, v, p) => {
    for (const mapper of reversed) {
      const out = mapper(k, v, p)
      if (out === false) return false
      if (!out || out === true) continue
      return out
    }
  }
  return combined
}
