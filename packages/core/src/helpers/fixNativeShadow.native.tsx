import { ViewStyle } from 'react-native'

const matchRgbaHsla =
  /(rgba|hsla)\(\s*([\d\.]{1,}%?)\s*,\s*([\d\.]{1,}%?)\s*,\s*([\d\.]{1,}%?)\s*,\s*([\d\.]{1,})\s*\)$/

export function fixNativeShadow(props: ViewStyle) {
  if (!props.shadowColor || props.shadowColor === 'transparent') {
    return
  }
  if (!props.shadowOffset) {
    // fixes some broken shadows
    props.shadowOffset = {
      width: 0,
      height: 0,
    }
  }
  const c = String(props.shadowColor)
  // react native has issues sometimes with rgba/hsla() convert to color + opacity
  if ((c[0] === 'r' || c[0] === 'h') && c[3] === 'a') {
    const [_, type, _1, _2, _3, a] = c.match(matchRgbaHsla) || []
    if (typeof a !== 'string') {
      console.trace('invalid', c, type)
      throw new Error(`invalid style`)
    }
    props.shadowColor = `${type.replace('a', '')}(${_1},${_2},${_3})`
    props.shadowOpacity = props.shadowOpacity ?? +a
  } else {
    props.shadowOpacity = props.shadowOpacity ?? 1
  }
}
