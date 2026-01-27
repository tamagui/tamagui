// web-only: use color-mix for opacity, no parsing needed
// browsers handle named colors, hex, rgb, hsl natively

export const normalizeColor = (color?: string | null, opacity?: number) => {
  if (!color) return
  // handle dynamic color objects (from $theme-dark/$theme-light)
  if (typeof color !== 'string') return color

  // apply opacity via color-mix (widely supported: Chrome 111+, Safari 16.2+, Firefox 113+)
  if (typeof opacity === 'number' && opacity < 1) {
    return `color-mix(in srgb, ${color} ${Math.round(opacity * 100)}%, transparent)`
  }

  return color
}

// stub for native compat - native uses normalizeColor.native.ts which has real impl
export const getRgba = (
  _color: string
): { r: number; g: number; b: number; a: number } | undefined => undefined
