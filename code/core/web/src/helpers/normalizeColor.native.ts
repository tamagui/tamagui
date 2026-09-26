import { normalizeCSSColor, rgba } from '@tamagui/normalize-css-color'

export { rgba } from '@tamagui/normalize-css-color'

// a theme value on native can be a DynamicColorIOS object rather than a string
type DynamicColor = { dynamic: Record<string, string> }

const isDynamicColor = (color: any): color is DynamicColor =>
  typeof color.dynamic === 'object' && color.dynamic !== null

export const normalizeColor = (
  color?: string | DynamicColor | null,
  opacity?: number
) => {
  if (!color) return
  // DynamicColorIOS carries one color per appearance, so an opacity has to reach
  // each variant. returning the object untouched is what made `$color/50` resolve
  // to the fully opaque color on native.
  //
  // opacity 1 means "no override" here, not "make it opaque": the shadow call
  // site in getSplitStyles defaults its opacity argument to 1, so applying it
  // would drop a shadow token's own alpha and paint solid black.
  if (typeof color !== 'string') {
    if (opacity === undefined || opacity === 1 || !isDynamicColor(color)) return color
    const dynamic: Record<string, string> = {}
    for (const key in color.dynamic) {
      const variant = normalizeColor(color.dynamic[key], opacity)
      if (typeof variant === 'string') dynamic[key] = variant
    }
    return { ...color, dynamic }
  }

  const rgbaVal = getRgba(color)
  if (rgbaVal) {
    const colors = `${rgbaVal.r},${rgbaVal.g},${rgbaVal.b}`
    return opacity === 1
      ? `rgb(${colors})`
      : `rgba(${colors},${opacity ?? rgbaVal.a ?? 1})`
  }

  return color
}

export const getRgba = (color: string) => {
  // handle dynamic color objects
  if (typeof color !== 'string') return
  // RN accepts the alpha forms with a slash, but requires the `a` function name.
  const nativeColor = color.replace(/^(rgb|hsl)\((?=[^)]*\/)/, '$1a(')
  const colorNum = normalizeCSSColor(nativeColor)
  if (colorNum != null) {
    return rgba(colorNum)
  }
}
