/**
 * Interpolate between two colors
 * @param color1 - First color (hex or hsl)
 * @param color2 - Second color (hex or hsl)
 * @param amount - 0 = color1, 1 = color2, 0.5 = middle
 */
export function interpolateColor(color1: string, color2: string, amount: number): string {
  const rgb1 = parseToRgb(color1)
  const rgb2 = parseToRgb(color2)
  if (!rgb1 || !rgb2) return color1

  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * amount)
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * amount)
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * amount)

  return `rgb(${r}, ${g}, ${b})`
}

function parseToRgb(color: string): { r: number; g: number; b: number } | null {
  if (typeof color !== 'string') return null

  // Handle hex
  if (color.startsWith('#')) {
    let hex = color.slice(1)
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('')
    }
    if (hex.length >= 6) {
      return {
        r: Number.parseInt(hex.slice(0, 2), 16),
        g: Number.parseInt(hex.slice(2, 4), 16),
        b: Number.parseInt(hex.slice(4, 6), 16),
      }
    }
  }

  // Handle rgb/rgba
  if (color.startsWith('rgb')) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (match) {
      return {
        r: Number.parseInt(match[1], 10),
        g: Number.parseInt(match[2], 10),
        b: Number.parseInt(match[3], 10),
      }
    }
  }

  // Handle hsl/hsla
  if (color.startsWith('hsl')) {
    const match = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/)
    if (match) {
      const h = Number.parseInt(match[1], 10)
      const s = Number.parseInt(match[2], 10) / 100
      const l = Number.parseInt(match[3], 10) / 100
      return hslToRgb(h, s, l)
    }
  }

  return null
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  let r: number
  let g: number
  let b: number
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h / 360 + 1 / 3)
    g = hue2rgb(p, q, h / 360)
    b = hue2rgb(p, q, h / 360 - 1 / 3)
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

export function opacify(color: string, opacity = 0.1): string {
  // Handle dynamic color objects (from $theme-dark/$theme-light)
  if (typeof color !== 'string') return color

  // handle hsl/hsla
  if (color.startsWith('hsl')) {
    const match = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([\d.]+))?\)/)
    if (match) {
      const [, h, s, l] = match
      return `hsla(${h}, ${s}%, ${l}%, ${opacity})`
    }
  }

  // handle hex
  if (color.startsWith('#')) {
    let hex = color.slice(1)

    // expand shorthand hex
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('')
    }

    // set alpha channel to specified opacity
    if (hex.length === 6 || hex.length === 8) {
      const alphaHex = Math.round(opacity * 255)
        .toString(16)
        .padStart(2, '0')
      return `#${hex.slice(0, 6)}${alphaHex}`
    }
  }

  return color
}
