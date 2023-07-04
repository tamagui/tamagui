import { createTheme } from './createTheme'
import { objectEntries, objectFromEntries } from './helpers'
import { isMinusZero } from './isMinusZero'
import { ThemeInfo, getThemeInfo, setThemeInfo } from './themeInfo'
import { CreateMask, GenericTheme, MaskFunction, MaskOptions, ThemeMask } from './types'

export const createMask = <C extends CreateMask | MaskFunction>(
  createMask: C
): CreateMask =>
  typeof createMask === 'function'
    ? { name: createMask.name || 'unnamed', mask: createMask }
    : createMask

export const combineMasks = (...masks: CreateMask[]) => {
  const mask: CreateMask = {
    name: 'combine-mask',
    mask: (template, opts) => {
      let current = getThemeInfo(template, opts.parentName)
      let theme: any
      for (const mask of masks) {
        if (!current) throw `❌`
        const next = applyMaskStateless(current, mask, opts)
        current = next
        theme = next.theme
      }
      return theme
    },
  }
  return mask
}

export const skipMask: CreateMask = {
  name: 'skip-mask',
  mask: (template, { skip }) => {
    if (!skip) return template
    return Object.fromEntries(
      Object.entries(template).filter(([k]) => !(k in skip))
    ) as typeof template
  },
}

export const createIdentityMask = (): CreateMask => ({
  name: 'identity-mask',
  mask: (template) => template,
})

export const createInverseMask = () => {
  const mask: CreateMask = {
    name: 'inverse-mask',
    mask: (template, opts) => {
      const inversed = objectFromEntries(
        objectEntries(template).map(([k, v]) => [k, -v])
      ) as any
      return skipMask.mask(inversed, opts)
    },
  }
  return mask
}

type ShiftMaskOptions = { inverse?: boolean }

export const createShiftMask = (
  { inverse }: ShiftMaskOptions = {},
  defaultOptions?: MaskOptions
) => {
  const mask: CreateMask = {
    name: 'shift-mask',
    mask: (template, opts) => {
      const {
        override,
        max: maxIn,
        palette,
        min = 0,
        strength = 1,
      } = { ...defaultOptions, ...opts }
      const values = Object.entries(template)
      const max = maxIn ?? (palette ? Object.values(palette).length - 1 : Infinity)
      const out = {}
      for (const [key, value] of values) {
        if (typeof value === 'string') continue
        if (typeof override?.[key] === 'number') {
          const overrideShift = override[key] as number
          out[key] = value + overrideShift
          continue
        } else if (typeof override?.[key] === 'string') {
          out[key] = override[key]
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

      return skipMask.mask(out, opts) as typeof template
    },
  }
  return mask
}

export const createWeakenMask = (defaultOptions?: MaskOptions): CreateMask => ({
  name: 'soften-mask',
  mask: createShiftMask({}, defaultOptions).mask,
})

export const createSoftenMask = createWeakenMask

export const createStrengthenMask = (defaultOptions?: MaskOptions): CreateMask => ({
  name: 'strengthen-mask',
  mask: createShiftMask({ inverse: true }, defaultOptions).mask,
})

export function applyMaskStateless<Theme extends GenericTheme | ThemeMask>(
  info: ThemeInfo,
  mask: CreateMask,
  options: MaskOptions = {},
  parentName?: string
): ThemeInfo & {
  theme: Theme
} {
  const skip = {
    ...options.skip,
  }

  // skip nonInheritedValues from parent theme
  if (info.options?.nonInheritedValues) {
    for (const key in info.options.nonInheritedValues) {
      skip[key] = 1
    }
  }

  // convert theme back to template first
  const maskOptions = {
    parentName,
    palette: info.palette,
    ...options,
    skip,
  }

  const template = mask.mask(info.definition, maskOptions)
  const theme = createTheme(info.palette, template) as Theme

  return {
    ...info,
    cache: new Map(),
    definition: template,
    theme,
  }
}

export function applyMask<Theme extends GenericTheme | ThemeMask>(
  theme: Theme,
  mask: CreateMask,
  options: MaskOptions = {},
  parentName?: string,
  nextName?: string
): Theme {
  const info = getThemeInfo(theme, parentName)
  if (!info) {
    throw new Error(
      process.env.NODE_ENV !== 'production'
        ? `No info found for theme, you must pass the theme created by createThemeFromPalette directly to extendTheme`
        : `❌ Err2`
    )
  }

  const next = applyMaskStateless(info, mask, options, parentName)

  setThemeInfo(next.theme, {
    definition: next.definition,
    palette: info.palette,
    name: nextName,
  })

  return next.theme as Theme
}
