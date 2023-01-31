import { isRSC, isWeb } from '@tamagui/constants'
import { useContext } from 'react'

import { FontLanguageContext } from '../contexts/FontLanguageContext'
import { TextAncestorContext } from '../contexts/TextAncestorContext'
import { useSplitStyles } from '../helpers/getSplitStyles'
import {
  DebugProp,
  GetProps,
  SplitStyleState,
  TamaguiComponent,
  TextNonStyleProps,
} from '../types'
import { useMedia } from './useMedia'
import { useTheme } from './useTheme'

export function useStyle<
  Component extends TamaguiComponent,
  StyleProps = Omit<GetProps<Component>, keyof TextNonStyleProps>
>(
  base: Component,
  style: StyleProps,
  options?: Partial<SplitStyleState> & { debug?: DebugProp }
) {
  const isText = base.staticConfig.isText
  const hasTextAncestor = !!(isWeb && isText ? useContext(TextAncestorContext) : false)
  const languageContext = isRSC ? null : useContext(FontLanguageContext)
  const theme = useTheme()
  const media = useMedia()
  const out = useSplitStyles(
    style as any,
    base.staticConfig,
    theme,
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
