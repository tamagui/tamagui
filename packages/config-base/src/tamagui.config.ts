import { createInterFont } from '@tamagui/font-inter'
import { createSilkscreenFont } from '@tamagui/font-silkscreen'
import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/theme-base'

import { animations } from './animations'
import { createGenericFont } from './createGenericFont'
import { media } from './media'

const silkscreenFont = createSilkscreenFont()
const headingFont = createInterFont({
  size: {
    5: 13,
    6: 15,
  },
  transform: {
    6: 'uppercase',
    7: 'none',
  },
  weight: {
    6: '400',
    7: '700',
  },
  color: {
    6: '$colorFocus',
    7: '$color',
  },
  letterSpacing: {
    5: 2,
    6: 1,
    7: 0,
    8: 0,
    9: -1,
    10: -1,
    12: -2,
    14: -3,
    15: -4,
  },
}, {sizeLineHeight: (size) => size * 1.1})
const bodyFont = createInterFont(
  {},
  {
    sizeSize: (size) => Math.round(size * 1.1),
    sizeLineHeight: (size) => Math.round(size * 1.1 + (size >= 12 ? 12 : 4)),
  }
)
const monoFont = createGenericFont(
  `"ui-monospace", "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`
)

export const config = {
  defaultTheme: 'light',
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  animations,
  media,
  shorthands,
  themes,
  tokens,
  fonts: {
    // noto: notoFont as any,
    heading: headingFont,
    body: bodyFont,
    mono: monoFont,
    silkscreen: silkscreenFont,
  },
}
