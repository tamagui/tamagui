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
import type { TagName } from '@tamagui/dom'
import { createComponent } from './createComponent'
import { createVariables as createVariablesImpl } from './createVariables'
import { html } from './dom/html'
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

/** the tags `createFrontendHTML` builds, which is every tag of the DOM contract */
export type FrontendHTMLTag = TagName

/**
 * The DOM contract's elements rebuilt on another style frontend: same tags, same
 * element defaults, same runtime, only the authoring syntax differs. Mirrors
 * `createFrontendViews`, and is safe for the same reason: the regular singletons
 * keep their own config objects and `createComponent` never mutates one.
 */
export function createFrontendHTML(
  frontend: StyleFrontend
): Record<FrontendHTMLTag, FrontendComponent> {
  const out = {} as Record<FrontendHTMLTag, FrontendComponent>
  for (const tag in html) {
    const source = html[tag] as FrontendComponent & {
      rebindDOMTag?: (next: FrontendComponent) => FrontendComponent
    }
    // a tag native does not support is a thrower with nothing to rebuild
    if (!source.staticConfig) {
      out[tag] = source
      continue
    }
    const rebuilt = createComponent({
      ...source.staticConfig,
      styleFrontend: frontend,
      displayName: tag,
    })
    // on native the styling component is wrapped in the dom prop mapping, which
    // the rebuild has to keep
    out[tag] = source.rebindDOMTag ? source.rebindDOMTag(rebuilt) : rebuilt
  }
  return out
}
