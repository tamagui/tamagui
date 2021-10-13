const matchRgba =
  /rgba\(\s*([\d\.]{1,})\s*,\s*([\d\.]{1,})\s*,\s*([\d\.]{1,})\s*,\s*([\d\.]{1,})\s*\)$/

export function fixNativeShadow(props: any) {
  if (props.shadowColor) {
    if (!!!('shadowOffset' in props)) {
      // fixes some broken shadows
      props.shadowOffset = {
        width: 0,
        height: 0,
      }
    }
    if (!!!('shadowOpacity' in props)) {
      const c = `${props.shadowColor}`
      // react native has issues sometimes with rgba()
      if (c[0] === 'r' && c[3] === 'a') {
        const [_, r, g, b, a] = c.match(matchRgba) || []
        if (typeof a !== 'string') {
          console.warn('non valid rgba', c)
          return props
        }
        props.shadowColor = `rgb(${r},${g},${b})`
        props.shadowOpacity = +a
      }
    }
  }
}
