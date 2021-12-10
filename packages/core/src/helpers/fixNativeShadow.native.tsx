const matchRgbaHsla =
  /(rgba|hsla)\(\s*([\d\.]{1,}%?)\s*,\s*([\d\.]{1,}%?)\s*,\s*([\d\.]{1,}%?)\s*,\s*([\d\.]{1,})\s*\)$/

export function fixNativeShadow(props: any) {
  if (!props.shadowColor) {
    return
  }
  if (!props.shadowOffset) {
    // fixes some broken shadows
    props.shadowOffset = {
      width: 0,
      height: 0,
    }
  }
  if ('shadowOpacity' in props) {
    return
  }
  const c = `${props.shadowColor}`
  // react native has issues sometimes with rgba()
  // supports rgba + hsla
  if ((c[0] === 'r' || c[0] === 'h') && c[3] === 'a') {
    const [_, type, _1, _2, _3, a] = c.match(matchRgbaHsla) || []
    if (typeof a !== 'string') {
      console.warn('invalid', c, type)
      return
    }
    props.shadowColor = `${type.replace('a', '')}(${_1},${_2},${_3})`
    props.shadowOpacity = +a
  } else {
    props.shadowOpacity = 1
  }
}
