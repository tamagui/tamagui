import { getConfig } from '../config'
import { getVariableValue } from '../createVariable'
import type { GenericSizing, SizeName, StyledDynamicEnv } from '../types'

/** a size name resolved against the config: rung token keys plus derived px */
export type ResolvedSizing = {
  name: string
  fontSize: string
  lineHeight: string
  controlFontSize: string
  paddingInline: string
  paddingBlock: string
  gap: string
  radius: string
  height: number
  icon: number
  square: number
}

type SizingSource = {
  sizing: GenericSizing | undefined
  tokens: StyledDynamicEnv['tokens']
  font: { size?: Record<string, any>; lineHeight?: Record<string, any> } | undefined
}

const px = (value: unknown): number => +getVariableValue(value)

const resolveWith = (
  name: SizeName | boolean | undefined,
  source: SizingSource
): ResolvedSizing => {
  const sizing = source.sizing
  if (!sizing) {
    throw new Error(
      '[tamagui] no sizing in config. add sizing to createTamagui, e.g. spread defaultSizing from @tamagui/config.'
    )
  }
  // true and absent mean the default size. false is not a size, but boolean is
  // in the prop type, so it resolves the same way rather than throwing.
  const key = typeof name === 'string' ? name.replace(/^\$/, '') : sizing.default
  const rung = sizing.sizes[key]
  if (!rung) {
    throw new Error(
      `[tamagui] unknown size "${String(name)}". valid sizes: ${Object.keys(sizing.sizes).join(', ')}.`
    )
  }
  const font = source.font as any
  const fontSize = px(font?.size?.[rung.fontSize])
  const lineHeight = px(font?.lineHeight?.[rung.fontSize])
  const controlFontSize = px(font?.size?.[rung.controlFontSize])
  const paddingBlock = px(source.tokens.space?.[rung.paddingBlock])
  return {
    name: key,
    fontSize: rung.fontSize,
    lineHeight: rung.fontSize,
    controlFontSize: rung.controlFontSize,
    paddingInline: rung.paddingInline,
    paddingBlock: rung.paddingBlock,
    gap: rung.gap,
    radius: rung.radius,
    height: sizing.height({ fontSize, lineHeight, paddingBlock }),
    icon: sizing.icon({ fontSize }),
    square: sizing.square({ controlFontSize }),
  }
}

/** a size name to its rung resolved to pixels, against the config in `env` */
export const resolveSizing = (
  name: SizeName | boolean | undefined,
  env: StyledDynamicEnv
): ResolvedSizing =>
  resolveWith(name, {
    sizing: env.sizing,
    tokens: env.tokens,
    font: env.font as SizingSource['font'],
  })

/** runtime form of resolveSizing for components outside style resolution */
export const getSizing = (name: SizeName | boolean | undefined): ResolvedSizing => {
  const conf = getConfig()
  return resolveWith(name, {
    sizing: conf.sizing,
    tokens: conf.tokensParsed,
    font: conf.fontsParsed[conf.defaultFontToken],
  })
}
