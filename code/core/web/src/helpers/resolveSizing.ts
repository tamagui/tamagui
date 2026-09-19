import { getConfig } from '../config'
import { getVariableValue } from '../createVariable'
import type {
  ComponentSize,
  Font,
  GenericSizing,
  SizeRecipe,
  TamaguiConfig,
  TokensParsed,
} from '../types'

/** the env slice resolveSizing reads: a styled.dynamic env or hand-built */
export type SizingEnv = {
  sizing: GenericSizing
  fonts: TamaguiConfig['fonts']
  tokens: TokensParsed
  font?: Font
}

/**
 * the default control ladder, transcribed from the Button frame/text tables
 * so the derived px are identical by construction. v6 re-exports this;
 * resolveSizing falls back to it when a config carries no `sizing`.
 */
export const defaultSizing = {
  default: 'md',
  sizes: {
    xs: {
      fontSize: 'xs',
      controlFontSize: 'xs',
      paddingInline: '2',
      paddingBlock: '1',
      gap: '1',
      radius: 'sm',
    },
    sm: {
      fontSize: 'sm',
      controlFontSize: 'sm',
      paddingInline: '3',
      paddingBlock: '1.5',
      gap: '1.5',
      radius: 'md',
    },
    md: {
      fontSize: 'sm',
      controlFontSize: 'base',
      paddingInline: '4',
      paddingBlock: '2',
      gap: '2',
      radius: 'md',
    },
    lg: {
      fontSize: 'base',
      controlFontSize: 'lg',
      paddingInline: '6',
      paddingBlock: '2',
      gap: '2',
      radius: 'md',
    },
    xl: {
      fontSize: 'lg',
      controlFontSize: 'xl',
      paddingInline: '8',
      paddingBlock: '2.5',
      gap: '2.5',
      radius: 'lg',
    },
  },
} as const satisfies GenericSizing

/** a rung resolved: token keys stay keys, geometry is px */
export type ResolvedSizing = {
  /** the rung that rendered (degrades to the default in production) */
  name: string
  fontSize: string
  lineHeight: string
  paddingInline: string
  paddingBlock: string
  gap: string
  radius: string
  /** text line box plus vertical padding, before any border */
  height: number
  /** icon px for the rung */
  icon: number
  /** the square controls: checkbox box, radio circle, switch track height */
  square: number
}

const toPx = (value: unknown): number =>
  typeof value === 'number' ? value : Number.parseFloat(value as string)

/**
 * a size name -> its rung resolved to pixels, against the sizing in `env`.
 * `true`/absent resolve to the default rung, `false` to no styles. Without
 * an env (plain render code, no styled.dynamic callback) it reads the active
 * config and default font: a sync global read, not a subscription, so static
 * sizes never re-render on media or theme changes. Unknown names resolve to
 * no styles, exactly like a miss in the old static tables: numeric sizes and
 * cascaded values pass through variants that do not know them, and must never
 * throw. A rung pointing at missing tokens is a broken config: it warns in
 * development and resolves to no styles.
 */
export function resolveSizing(size: false, env?: SizingEnv): undefined
export function resolveSizing(
  size: ComponentSize | true | undefined,
  env?: SizingEnv
): ResolvedSizing
export function resolveSizing(
  size: ComponentSize | boolean | undefined,
  env?: SizingEnv
): ResolvedSizing | undefined
export function resolveSizing(
  size: ComponentSize | boolean | undefined,
  env?: SizingEnv
): ResolvedSizing | undefined {
  if (size === false) return undefined
  const conf = env?.fonts && env?.tokens ? undefined : getConfig()
  const sizing = { ...defaultSizing, ...(env?.sizing ?? conf?.sizing) }
  const name = size === true || size == null ? sizing.default : size
  const rung: SizeRecipe | undefined = sizing.sizes[name]
  if (!rung) return undefined

  const keys = {
    fontSize: rung.fontSize,
    lineHeight: rung.fontSize,
    paddingInline: rung.paddingInline,
    paddingBlock: rung.paddingBlock,
    gap: rung.gap,
    radius: rung.radius,
  }
  // an explicit rung geometry wins over derivation (v5 pins its heights)
  if (rung.px) {
    return {
      name,
      ...keys,
      height: rung.px.height,
      icon: rung.px.icon,
      square: rung.px.square,
    }
  }

  const fonts = env?.fonts ?? conf?.fontsParsed
  const tokens = env?.tokens ?? conf?.tokensParsed
  const font = env?.font ?? fonts?.[conf?.defaultFontToken ?? 'body']
  const px = {
    fontSize: toPx(getVariableValue(font?.size?.[rung.fontSize])),
    control: toPx(getVariableValue(font?.size?.[rung.controlFontSize])),
    lineHeight: toPx(getVariableValue(font?.lineHeight?.[rung.fontSize])),
    paddingBlock: toPx(getVariableValue(tokens?.space?.[rung.paddingBlock])),
  }
  if (!Object.values(px).every(Number.isFinite)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[tamagui] size "${name}" references a missing token (fontSize "${rung.fontSize}", controlFontSize "${rung.controlFontSize}", paddingBlock "${rung.paddingBlock}"); resolving to no styles`
      )
    }
    return undefined
  }

  return {
    name,
    ...keys,
    height: px.lineHeight + px.paddingBlock * 2,
    icon: Math.ceil(px.fontSize / 4) * 4,
    square: Math.round(px.control * 1.4),
  }
}
