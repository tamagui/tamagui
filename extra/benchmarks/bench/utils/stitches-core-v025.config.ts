import { createCss } from '@stitches/core-v025'

import { config, darkThemeConfig } from './stitches-default-config-v025'

export const { css, theme, getCssString, global, keyframes } = createCss(config)

export const darkTheme = theme('dark-theme', darkThemeConfig)
