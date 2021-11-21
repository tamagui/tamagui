import { createCss } from '@stitches/react-v025'

import { config, darkThemeConfig } from './stitches-default-config-v025'

export const { css, theme, getCssString, global, keyframes, styled } = createCss(config)

export const darkTheme = theme('dark-theme', darkThemeConfig)
