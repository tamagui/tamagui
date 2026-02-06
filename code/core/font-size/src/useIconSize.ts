import { useContext } from 'react'
import type { FontTokens, SizeTokens, Token } from '@tamagui/core'
import { ComponentContext, getTokenValue } from '@tamagui/core'
import type { IconSizing } from '@tamagui/core'
import { getFontSize } from './getFontSize'

type UseIconSizeOpts = {
  sizeToken: SizeTokens | Token | number | undefined
  scaleIcon?: number
}

/**
 * resolves icon size based on the iconSizing setting from Configuration context.
 *
 * each component passes its own default scaleIcon (e.g. 0.5 for Button, 0.65 for Checkbox).
 * the user's scaleIcon prop should override the component default before passing here.
 *
 * returns a number (pixel size) or undefined (let icon self-size in font-* mode).
 */
export const useIconSize = (opts: UseIconSizeOpts): number | undefined => {
  const ctx = useContext(ComponentContext)
  const iconSizing = ctx?.iconSizing ?? 'size-scaled'
  return getIconSize({ ...opts, iconSizing })
}

type GetIconSizeOpts = UseIconSizeOpts & {
  iconSizing: IconSizing
}

export const getIconSize = (opts: GetIconSizeOpts): number | undefined => {
  const { sizeToken, scaleIcon = 1, iconSizing } = opts

  if (sizeToken == null) return undefined

  if (iconSizing === 'size-scaled') {
    const base = typeof sizeToken === 'number' ? sizeToken : getFontSize(sizeToken as any)
    return base * scaleIcon
  }

  if (iconSizing === 'size') {
    const base =
      typeof sizeToken === 'number'
        ? sizeToken
        : ((getTokenValue(sizeToken as Token, 'size') as number) ??
          getFontSize(sizeToken as any))
    return base * scaleIcon
  }

  // font-* mode: e.g. 'font-body' -> font = '$body'
  if (iconSizing.startsWith('font-')) {
    const fontName = `$${iconSizing.slice(5)}` as FontTokens

    // when scaleIcon is explicitly not 1, resolve size with the specified font
    if (scaleIcon !== 1) {
      const base =
        typeof sizeToken === 'number'
          ? sizeToken
          : getFontSize(sizeToken as any, { font: fontName })
      return base * scaleIcon
    }

    // otherwise let the icon handle its own sizing
    return undefined
  }

  // fallback
  const base = typeof sizeToken === 'number' ? sizeToken : getFontSize(sizeToken as any)
  return base * scaleIcon
}
