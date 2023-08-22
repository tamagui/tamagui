import { useContext } from 'react'

import { ComponentContext } from '../contexts/ComponentContext'
import { defaultComponentState } from '../createComponent'
import { useSplitStyles } from '../helpers/getSplitStyles'
import {
  DebugProp,
  GetProps,
  SplitStyleProps,
  TamaguiComponent,
  TextNonStyleProps,
} from '../types'
import { useMedia } from './useMedia'
import { useThemeWithState } from './useTheme'

export function useStyle<
  Component extends TamaguiComponent,
  StyleProps = Omit<GetProps<Component>, keyof TextNonStyleProps>
>(
  base: Component,
  style: StyleProps,
  options?: Partial<SplitStyleProps> & { debug?: DebugProp }
) {
  const isText = base.staticConfig.isText
  const componentContext = useContext(ComponentContext)
  const [themeState] = useThemeWithState({})
  const media = useMedia()
  const out = useSplitStyles(
    style as any,
    base.staticConfig,
    themeState.state.theme!,
    themeState.state.name,
    defaultComponentState,
    {
      ...(options as any),
      mediaState: media,
      resolveVariablesAs: 'auto',
    },
    null,
    componentContext,
    isText ? 'span' : 'div',
    options?.debug
  )
  return {
    style: Object.keys(out.style).length ? out.style : null,
    classNames: out.classNames,
  }
}
