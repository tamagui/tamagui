import { getConfig, stylePropsTextOnly } from '@tamagui/web'

import type { TextParentStyles } from './types'

/** moves text-only styles to their longhand keys and leaves every other prop alone */
export function splitTextProps<Props extends object>(props: Props) {
  const textProps: Record<string, unknown> = {}
  const viewProps: Record<string, unknown> = {}
  const shorthands = getConfig().shorthands

  for (const [key, value] of Object.entries(props)) {
    const expandedKey = shorthands[key] || key
    if (
      expandedKey in stylePropsTextOnly ||
      expandedKey === 'ellipsis' ||
      expandedKey === 'maxFontSizeMultiplier' ||
      expandedKey === 'noTextWrap' ||
      expandedKey === 'numberOfLines' ||
      expandedKey === 'textProps'
    ) {
      textProps[expandedKey] = value
    } else {
      viewProps[key] = value
    }
  }

  return [textProps, viewProps] as [
    Partial<TextParentStyles>,
    Omit<Props, keyof TextParentStyles>,
  ]
}
