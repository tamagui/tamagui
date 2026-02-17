import type { StackStyle } from '../types'

export const THEME_NAME_SEPARATOR = '_'
export const THEME_CLASSNAME_PREFIX = 't_'
export const FONT_DATA_ATTRIBUTE_NAME = 'data-tamagui-font'

export const MISSING_THEME_MESSAGE =
  process.env.NODE_ENV === 'development'
    ? `Can't find Tamagui configuration.
    
Most of the time this is due to having mis-matched versions of Tamagui dependencies, or bundlers somehow duplicating them.
First step is to ensure every "tamagui" and "@tamagui/*" dependency is on the same version, we have a CLI tool to help: 

  npx @tamagui/cli check
`
    : `Missing theme.`
