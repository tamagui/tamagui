import type { SplitStyleProps, TamaguiComponentState } from '@tamagui/web'
import { getConfig, getSplitStyles } from '@tamagui/web'
import {
  StyleObjectIdentifier,
  StyleObjectProperty,
  StyleObjectPseudo,
} from '@tamagui/helpers'
import { tailwindStyleFrontend } from '../frontend'

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
 * Runs the two steps a Tailwind component performs: the frontend descriptor's
 * static-config normalization and prop preprocessing, then the shared renderer's
 * style split. Everything after `preprocessProps` is core, unchanged.
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
  const config = getConfig()
  const staticConfig = tailwindStyleFrontend.normalizeStaticConfig!(
    component.staticConfig,
    config
  )
  const preprocessed = tailwindStyleFrontend.preprocessProps(props, config)

  const styleProps = {
    mediaState: options.mediaState,
    isAnimated: false,
    resolveValues: 'auto',
  } satisfies SplitStyleProps

  return getSplitStyles(
    preprocessed,
    staticConfig,
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
  }
  return null
}

/** the resolved native style record, which is what native components render with */
export function styleOf(result: { style?: any }): Record<string, any> {
  return (result.style || {}) as Record<string, any>
}
