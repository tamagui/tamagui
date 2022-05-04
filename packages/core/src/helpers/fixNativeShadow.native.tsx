const matchRgbaHsla =
  /(rgba|hsla)\(\s*([\d\.]{1,}%?)\s*,\s*([\d\.]{1,}%?)\s*,\s*([\d\.]{1,}%?)\s*,\s*([\d\.]{1,})\s*\)$/

export function fixNativeShadow(styles: [string, any][]) {
  const color = styles.find((x) => x[0] === 'shadowColor')
  if (!color) {
    return
  }
  if (!styles.find((x) => x[0] === 'shadowOffset')) {
    // fixes some broken shadows
    styles.push([
      'shadowOffset',
      {
        width: 0,
        height: 0,
      },
    ])
  }
  if (styles.find((x) => x[0] === 'shadowOpacity')) {
    return
  }
  const c = `${color[1]}`
  // react native has issues sometimes with rgba()
  // supports rgba + hsla
  if ((c[0] === 'r' || c[0] === 'h') && c[3] === 'a') {
    const [_, type, _1, _2, _3, a] = c.match(matchRgbaHsla) || []
    if (typeof a !== 'string') {
      console.trace('invalid', c, type)
      throw new Error(`invalid style`)
    }
    styles.push(['shadowColor', `${type.replace('a', '')}(${_1},${_2},${_3})`])
    styles.push(['shadowOpacity', +a])
  } else {
    styles.push(['shadowOpacity', 1])
  }
}
