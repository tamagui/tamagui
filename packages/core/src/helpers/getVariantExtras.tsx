import { getConfig } from '../conf'

export function getVariantExtras(
  props: any,
  theme?: any,
  defaultProps?: any,
  avoidDefaultProps = false
) {
  const conf = getConfig()
  return {
    fonts: conf.fontsParsed,
    tokens: conf.tokensParsed,
    theme,
    // TODO do this in splitstlye
    // we avoid passing in default props for media queries because that would confuse things like SizableText.size:
    props: avoidDefaultProps
      ? props
      : new Proxy(props, {
          get(target, key) {
            if (Reflect.has(target, key)) {
              return Reflect.get(target, key)
            }
            // these props may be extracted into classNames, but we still want to access them
            // at runtime, so we proxy back to defaultProps but don't pass them
            if (defaultProps) {
              return Reflect.get(defaultProps, key)
            }
          },
        }),
  }
}
