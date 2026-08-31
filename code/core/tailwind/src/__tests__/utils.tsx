import type { SplitStyleProps, TamaguiComponentState } from '@tamagui/web'
import { getSplitStyles } from '@tamagui/web'
import {
  StyleObjectIdentifier,
  StyleObjectProperty,
  StyleObjectPseudo,
  StyleObjectRules,
} from '@tamagui/helpers'

const emptyObj = {} as any

const mountedState: TamaguiComponentState = {
  hover: false,
  press: false,
  pressIn: false,
  focus: false,
  focusVisible: false,
  focusWithin: false,
  unmounted: false,
  disabled: false,
}

/**
 * Runs the shared renderer with a Tailwind component. `getSplitStyles` follows
 * the component's descriptor for static-config normalization and direct-caller
 * preprocessing, which is the same package-selected path production uses.
 */
export function splitTailwindStyles(
  component: { staticConfig: any },
  props: Record<string, any>,
  options: {
    mediaState?: Record<string, any>
    componentState?: Partial<TamaguiComponentState>
    theme?: any
    themeName?: string
    groupContext?: any
  } = {}
) {
  const styleProps = {
    mediaState: options.mediaState,
    isAnimated: false,
    resolveValues: 'auto',
  } satisfies SplitStyleProps

  return getSplitStyles(
    props,
    component.staticConfig,
    options.theme ?? emptyObj,
    options.themeName ?? '',
    {
      ...mountedState,
      ...options.componentState,
    },
    styleProps,
    emptyObj,
    {
      animationDriver: {},
      groups: {
        state: {},
      },
    } as any,
    options.groupContext,
    undefined,
    true
  )!
}

// find a rule by CSS property name, optionally filtering by pseudo state
export function findRule(rulesToInsert: any, prop: string, pseudo?: string) {
  for (const rule of Object.values(rulesToInsert || {})) {
    const r = rule as any
    if (r[StyleObjectProperty] === prop) {
      if (pseudo === undefined) {
        if (
          r[StyleObjectPseudo] === undefined &&
          !r[StyleObjectIdentifier]?.includes('_sm') &&
          !r[StyleObjectIdentifier]?.includes('_md')
        ) {
          return r
        }
      } else if (r[StyleObjectPseudo] === pseudo) {
        return r
      }
    }
    const property = prop.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    for (const css of r[StyleObjectRules] || []) {
      const match = css.match(new RegExp(`[;{]${property}:([^;}]+)`))
      if (match && (pseudo === undefined || css.includes(`:${pseudo}`))) {
        return [prop, match[1], r[StyleObjectIdentifier], pseudo, [css]]
      }
    }
  }
  return null
}

/** the resolved native style record, which is what native components render with */
export function styleOf(result: { style?: any }): Record<string, any> {
  return (result.style || {}) as Record<string, any>
}
