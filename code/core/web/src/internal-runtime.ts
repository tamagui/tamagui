/**
 * Private implementation boundary shared by Tamagui workspace packages. Not public
 * API: never reexport it from `@tamagui/web`, `@tamagui/core`, `tamagui`, or
 * `@tamagui/tailwind` roots. Doing so would expose implementation details again.
 *
 * It deliberately exposes purpose-built, explicitly typed wrappers rather than raw
 * module reexports. That keeps the private declaration entry narrow and avoids
 * reconnecting the regular root barrel.
 */
import type { FunctionComponent } from 'react'
import { stylePropsUnitless } from '@tamagui/helpers'
import { createComponent } from './createComponent'
import { createVariables as createVariablesImpl } from './createVariables'
import { fixStyles as fixStylesImpl } from './helpers/expandStyles'
import { styleToCSS as styleToCSSImpl } from './helpers/styleToCSS'
import { getThemeCSSRules as getThemeCSSRulesImpl } from './helpers/getThemeCSSRules'
import { normalizeValueWithProperty as normalizeValueWithPropertyImpl } from './helpers/normalizeValueWithProperty'
import { proxyThemeToParents as proxyThemeToParentsImpl } from './helpers/proxyThemeToParents'
import type { FrontendComponent, StyleFrontend } from './helpers/styleFrontend'
import { ensureThemeVariable as ensureThemeVariableImpl } from './helpers/themes'
import { transformsToString as transformsToStringImpl } from './helpers/transformsToString'
import {
  parseFont as parseFontImpl,
  registerFontVariables as registerFontVariablesImpl,
} from './insertFont'
import { createTamagui as createTamaguiImpl } from './createTamagui'
import { setupHooks as setupHooksImpl } from './setupHooks'
import { createFrontendStyled as createFrontendStyledImpl } from './styled'
import { useThemeWithState as useThemeWithStateImpl } from './hooks/useTheme'
import { TamaguiProvider as TamaguiProviderImpl } from './views/TamaguiProvider'
import { textStaticConfig } from './views/Text'
import { viewStaticConfig } from './views/View'

export { mergeFrontendCondition, regularStyleFrontend } from './helpers/styleFrontend'
export type * from './internalRuntimeTypes'

export const createVariables: (
  tokens: Record<string, any>,
  parentPath?: string,
  isFont?: boolean
) => any = createVariablesImpl as any
export const parseFont: (definition: Record<string, any>) => any = parseFontImpl as any
export const registerFontVariables: (parsedFont: any) => string[] =
  registerFontVariablesImpl
export const fixStyles: (style: Record<string, any>) => void = fixStylesImpl
export const getThemeCSSRules: (props: {
  config: any
  themeName: string
  theme: any
  names: string[]
  hasDarkLight?: boolean
  useMutatedVariables?: boolean
}) => string[] = getThemeCSSRulesImpl
export const normalizeValueWithProperty: (value: any, property?: string) => any =
  normalizeValueWithPropertyImpl
export const proxyThemeToParents: (themeName: string, theme: any) => any =
  proxyThemeToParentsImpl
export const ensureThemeVariable: (theme: any, key: string) => void =
  ensureThemeVariableImpl
export const transformsToString: (transforms: object[]) => string = transformsToStringImpl
export const styleToCSS: (style: Record<string, any>) => void = styleToCSSImpl
export const useThemeWithState: (
  props: any,
  isRoot?: boolean,
  forThemeView?: boolean
) => [any, any] = useThemeWithStateImpl

// the one scalar-to-css boundary used by frontends before they mint a conditional
// value. strings already carry their authored units; finite numbers use the same
// property table as direct atomic styles on both web and native.
export const plainValueToPayload = (value: unknown, property: string): string | null => {
  if (typeof value === 'string') return value
  if (typeof value !== 'number' || !Number.isFinite(value)) return null
  if (
    property === 'rotate' ||
    property === 'rotateX' ||
    property === 'rotateY' ||
    property === 'rotateZ'
  ) {
    return value === 0 ? '0' : `${value}deg`
  }
  if (
    property === 'x' ||
    property === 'y' ||
    property === 'perspective' ||
    property === 'translateX' ||
    property === 'translateY'
  ) {
    return value === 0 ? '0' : `${value}px`
  }
  return stylePropsUnitless[property] ? String(value) : `${value}px`
}

// shared-runtime pieces the platform setup module in `@tamagui/core` needs. They are
// explicitly typed here rather than reexported from their source modules, so the
// private declaration entry does not reconnect those modules' public type graph.
export const createTamagui: (config: any) => any = createTamaguiImpl
export const setupHooks: (hooks: Record<string, any>) => void = setupHooksImpl
export const TamaguiProvider: FunctionComponent<any> = TamaguiProviderImpl

export function createFrontendStyled(
  frontend: StyleFrontend
): (
  ComponentIn: any,
  optionsOrBaseClassName?: any,
  configOrOptions?: any,
  maybeConfig?: any
) => FrontendComponent {
  return createFrontendStyledImpl(frontend)
}

/**
 * Distinct View/Text component objects carrying `frontend`. The regular singletons
 * are untouched: only their static configuration is shared, and `createComponent`
 * does not mutate the config it receives.
 */
export function createFrontendViews(frontend: StyleFrontend): {
  View: FrontendComponent
  Text: FrontendComponent
} {
  return {
    View: createComponent({
      ...viewStaticConfig,
      styleFrontend: frontend,
      displayName: 'View',
    }),
    Text: createComponent({
      ...textStaticConfig,
      styleFrontend: frontend,
      displayName: 'Text',
    }),
  }
}
