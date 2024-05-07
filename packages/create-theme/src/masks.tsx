import type { CreateMask, MaskFunction, MaskOptions } from './createThemeTypes'
import { objectEntries, objectFromEntries } from './helpers'
import { isMinusZero } from './isMinusZero'

export const createMask = <C extends CreateMask | MaskFunction>(
  createMask: C
): CreateMask =>
  typeof createMask === 'function'
    ? { name: createMask.name || 'unnamed', mask: createMask }
    : createMask

export const skipMask: CreateMask = {
  name: 'skip-mask',
  mask: (template, opts) => {
    const { skip } = opts
    const result = Object.fromEntries(
      Object.entries(template)
        .filter(([k]) => !skip || !(k in skip))
        .map(([k, v]) => [k, applyOverrides(k, v, opts)])
    ) as typeof template

    return result
  },
}

function applyOverrides(key: string, value: number | string, opts: MaskOptions) {
  let override: string | number | undefined
  let strategy = opts.overrideStrategy

  const overrideSwap = opts.overrideSwap?.[key]
  if (typeof overrideSwap !== 'undefined') {
    override = overrideSwap
    strategy = 'swap'
  } else {
    const overrideShift = opts.overrideShift?.[key]
    if (typeof overrideShift !== 'undefined') {
      override = overrideShift
      strategy = 'shift'
    } else {
      const overrideDefault = opts.override?.[key]
      if (typeof overrideDefault !== 'undefined') {
        override = overrideDefault
        strategy = opts.overrideStrategy
      }
    }
  }

  if (typeof override === 'undefined') return value
  if (typeof override === 'string') return value

  if (strategy === 'swap') {
    return override
  }

  return value
}

export const createIdentityMask = (): CreateMask => ({
  name: 'identity-mask',
  mask: (template, opts) => skipMask.mask(template, opts),
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
        overrideStrategy = 'shift',
        max: maxIn,
        palette,
        min = 0,
        strength = 1,
      } = { ...defaultOptions, ...opts }
      const values = Object.entries(template)
      const max =
        maxIn ?? (palette ? Object.values(palette).length - 1 : Number.POSITIVE_INFINITY)
      const out = {}
      for (const [key, value] of values) {
        if (typeof value === 'string') continue
        if (typeof override?.[key] === 'number') {
          const overrideVal = override[key] as number
          out[key] = overrideStrategy === 'shift' ? value + overrideVal : overrideVal
          continue
        }
        if (typeof override?.[key] === 'string') {
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

      const skipped = skipMask.mask(out, opts) as typeof template
      return skipped
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
