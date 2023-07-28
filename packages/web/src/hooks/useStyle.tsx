import { isWeb } from '@tamagui/constants'
import { useContext } from 'react'

import { FontLanguageContext } from '../contexts/FontLanguageContext'
import { TextAncestorContext } from '../contexts/TextAncestorContext'
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
  const hasTextAncestor = !!(isWeb && isText ? useContext(TextAncestorContext) : false)
  const languageContext = useContext(FontLanguageContext)
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
      hasTextAncestor,
      resolveVariablesAs: 'auto',
    },
    null,
    languageContext || undefined,
    isText ? 'span' : 'div',
    options?.debug
  )
  return {
    style: Object.keys(out.style).length ? out.style : null,
    classNames: out.classNames,
  }
}
