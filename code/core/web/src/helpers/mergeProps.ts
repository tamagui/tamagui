export type GenericProps = Record<string, any>

// layers merge in order (defaults, styled context, the caller's props), so key
// order in the result follows that order. one rule for every layer: an
// undefined value never replaces what a lower layer set (React defaultProps
// semantics); it lands only when nothing set the key, which keeps `key in
// props` true for a caller who passed the key.
const mergeLayer = (out: GenericProps, layer: object) => {
  for (const key in layer) {
    const value = layer[key]
    if (value === undefined && key in out) continue
    out[key] = value
  }
}

export const mergeProps = (defaultProps: object, props: object) => {
  const out: GenericProps = {}
  mergeLayer(out, defaultProps)
  mergeLayer(out, props)
  return out
}

// same merge with a styled-context layer between defaults and props. also
// reports which context keys the caller's props overrode, in prop order, so
// the component can stop publishing those to its own descendants.
export const mergeComponentProps = (
  defaultProps: object | null | undefined,
  contextProps: object | null | undefined,
  props: object
) => {
  let overriddenContext: GenericProps | null = null

  if (!defaultProps && !contextProps) {
    return [props, overriddenContext] as const
  }

  const out: GenericProps = {}
  if (defaultProps) mergeLayer(out, defaultProps)
  if (contextProps) mergeLayer(out, contextProps)

  for (const key in props) {
    const value = props[key]
    if (value === undefined && key in out) continue
    out[key] = value
    if (contextProps && key in contextProps) {
      overriddenContext ||= {}
      overriddenContext[key] = value
    }
  }

  return [out, overriddenContext] as const
}
