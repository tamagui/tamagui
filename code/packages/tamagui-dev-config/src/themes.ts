import { createThemes, getTheme, levels, tokens, tree } from '@tamagui/themes/builder'

export const themes = createThemes(
  tokens,
  {
    light: tree.light,
    dark: tree.dark,
    children: {
      ...tree.children,
      blue: { palette: 'blue', treatment: 'tint', children: levels(2) },
      gray: { palette: 'gray', treatment: 'tint', children: levels(2) },
    },
  },
  { getTheme }
)
