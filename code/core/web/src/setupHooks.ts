import type { TamaguiComponentEvents } from './interfaces/TamaguiComponentEvents'
import type { TamaguiComponentState } from './interfaces/TamaguiComponentState'
import type { GetStyleResult, StaticConfig, TamaguiComponentStateRef } from './types'

export const hooks: InternalHooks = {}

// internal hooks setup
export function setupHooks(next: InternalHooks) {
  Object.assign(hooks, next)
}

type InternalHooks = {
  usePropsTransform?: (
    elementType: any,
    props: Record<string, any>,
    stateRef: { current: TamaguiComponentStateRef },
    willHydrate?: boolean
  ) => any

  setElementProps?: (node?: any) => void

  useEvents?: (
    viewProps: Record<string, any>,
    events: TamaguiComponentEvents | null,
    splitStyles: GetStyleResult,
    setStateShallow: (next: Partial<TamaguiComponentState>) => void,
    staticConfig: StaticConfig
  ) => any

  useChildren?: (elementType: any, children: any, viewProps: Record<string, any>) => any

  getBaseViews?: () => {
    View: any
    Text: any
    TextAncestor: any
  }
}
