import { BaseComponentProps } from './StackProps'

export const defaultShadowOffset = {
  width: 0,
  height: 0,
}

const matchRgba =
  /rgba\(\s*([\d\.]{1,})\s*,\s*([\d\.]{1,})\s*,\s*([\d\.]{1,})\s*,\s*([\d\.]{1,})\s*\)$/

// used by both expansion and inline, be careful
export function fixNativeShadow(props: BaseComponentProps, merge = false) {
  let res = merge ? props : {}
  if (props.shadowColor) {
    res.shadowColor = props.shadowColor
    if (!('shadowOffset' in props)) {
      res.shadowOffset = defaultShadowOffset
    }
    if (!('shadowOpacity' in props)) {
      res.shadowOpacity = 1
      const color = String(res.shadowColor).trim()
      if (color[0] === 'r' && color[3] === 'a') {
        const [_, r, g, b, a] = color.match(matchRgba) ?? []
        if (typeof a !== 'string') {
          console.warn('non valid rgba', color)
          return props
        }
        res.shadowColor = `rgb(${r},${g},${b})`
        res.shadowOpacity = +a
      } else {
        res.shadowOpacity = 1
      }
    }
  }
  return res
}
