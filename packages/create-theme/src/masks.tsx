import { THEME_INFO, createTheme } from './createTheme'
import { isMinusZero } from './isMinusZero'
import { CreateMask, GenericTheme, MaskOptions } from './types'

export const skipMask: CreateMask = (template, { skip }) => {
  if (!skip) return template
  return Object.fromEntries(
    Object.entries(template).filter(([k]) => !(k in skip))
  ) as typeof template
}

export const createIdentityMask = () => (template) => template

export const createShiftMask = ({ inverse }: { inverse?: boolean } = {}) => {
  return ((template, opts) => {
    const { override, max: maxIn, palette, min = 0, strength = 1 } = opts
    const values = Object.entries(template)
    const max = maxIn ?? (palette ? Object.values(palette).length - 1 : Infinity)
    const out = {}
    for (const [key, value] of values) {
      if (typeof value === 'string') continue
      if (typeof override?.[key] === 'number') {
        const overrideShift = override[key] as number
        out[key] = value + overrideShift
        continue
      }
      const isPositive = value === 0 ? !isMinusZero(value) : value >= 0
      const direction = isPositive ? 1 : -1
      const invert = inverse ? -1 : 1
      const next = value + strength * direction * invert
      const clamped = isPositive
        ? Math.max(min, Math.min(max, next))
        : Math.min(-min, Math.max(-max, next))

      out[key] = clamped
    }

    return skipMask(out, opts) as typeof template
  }) as CreateMask
}

export const createWeakenMask = () => createShiftMask()

export const createStrengthenMask = () => createShiftMask({ inverse: true })

export function applyMask<Theme extends GenericTheme>(
  theme: Theme,
  mask: CreateMask,
  options: MaskOptions = {}
): Theme {
  const info = THEME_INFO.get(theme)
  if (!info) {
    throw new Error(
      process.env.NODE_ENV !== 'production'
        ? `No info found for theme, you must pass the theme created by createThemeFromPalette directly to extendTheme`
        : `❌ Err2`
    )
  }

  const template = mask(info.definition, {
    palette: info.palette,
    ...options,
  })
  const next = createTheme(info.palette, template) as Theme

  return next
}
