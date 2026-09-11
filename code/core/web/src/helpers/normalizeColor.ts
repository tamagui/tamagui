// web: use color-mix for opacity (CSS-native, works with variables and named
// colors), so nothing here has to parse a color. animation drivers that need
// numeric channels handle their own conversion. `getRgba` is native-only, see
// normalizeColor.native.ts.

export const normalizeColor = (color?: string | null, opacity?: number) => {
  if (!color) return
  if (typeof color !== 'string') return color

  if (color === 'transparent') {
    return 'rgba(0, 0, 0, 0)'
  }

  if (typeof opacity === 'number' && opacity < 1) {
    return `color-mix(in srgb, ${color} ${Math.round(opacity * 100)}%, transparent)`
  }

  return color
}
