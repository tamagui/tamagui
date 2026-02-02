# Configuration Reference

## createTamagui

Main configuration function:

```tsx
import { createTamagui } from '@tamagui/core'

const config = createTamagui({
  tokens,
  themes,
  fonts,
  media,
  shorthands,
  animations,
  settings,
})

export default config
```

## Using Pre-built Configs

For most projects, start with a pre-built config:

```tsx
// v5 with CSS animations (web)
import { config } from '@tamagui/config/v5-css'

// v5 with Motion animations (cross-platform)
import { config } from '@tamagui/config/v5-motion'

// v5 with Reanimated (best native performance)
import { config } from '@tamagui/config/v5-reanimated'

// v5 base (no animations, add your own)
import { defaultConfig } from '@tamagui/config/v5'
import { animations } from '@tamagui/config/v5-css'

export default createTamagui({
  ...defaultConfig,
  animations,
})
```

## Tokens

Design system values referenced with `$` prefix:

```tsx
tokens: {
  color: {
    white: '#fff',
    black: '#000',
    blue: '#0066cc',
  },
  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    true: 16,  // default when using boolean
  },
  size: {
    0: 0,
    1: 20,
    2: 24,
    3: 28,
    4: 32,
    true: 32,
  },
  radius: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    true: 8,
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
  },
}
```

Usage:
```tsx
<View padding="$4" borderRadius="$2" />
```

## Themes

Define color schemes with semantic names:

```tsx
themes: {
  light: {
    background: '#fff',
    color: '#000',
    color1: '#f8f8f8',
    color2: '#f0f0f0',
    // ... color3-12
    borderColor: '#e0e0e0',
  },
  dark: {
    background: '#000',
    color: '#fff',
    color1: '#111',
    color2: '#222',
    // ... color3-12
    borderColor: '#333',
  },
  // sub-themes combine with parent: dark_blue, light_blue
  blue: {
    background: '#0066cc',
    color: '#fff',
  },
}
```

Usage:
```tsx
<Theme name="dark">
  <View backgroundColor="$background" />
</Theme>
```

## Fonts

```tsx
import { createFont } from '@tamagui/core'

const bodyFont = createFont({
  family: 'Inter, system-ui, sans-serif',
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
  },
  lineHeight: {
    1: 17,
    2: 20,
    3: 22,
    4: 24,
    5: 26,
    6: 30,
  },
  weight: {
    4: '400',
    5: '500',
    6: '600',
    7: '700',
  },
  letterSpacing: {
    4: 0,
    5: -0.2,
    6: -0.4,
  },
})

// in config
fonts: {
  body: bodyFont,
  heading: headingFont,
  mono: monoFont,
}
```

Usage:
```tsx
<Text fontFamily="$body" fontSize="$4" />
```

## Media Queries

```tsx
media: {
  xs: { maxWidth: 660 },
  sm: { maxWidth: 800 },
  md: { maxWidth: 1020 },
  lg: { maxWidth: 1280 },
  xl: { maxWidth: 1420 },
  // "greater than" queries
  gtXs: { minWidth: 661 },
  gtSm: { minWidth: 801 },
  gtMd: { minWidth: 1021 },
  gtLg: { minWidth: 1281 },
  // feature queries
  pointerFine: { pointer: 'fine' },
}
```

Usage:
```tsx
<View
  padding="$4"
  $gtSm={{ padding: '$6' }}
  $gtMd={{ padding: '$8' }}
/>
```

## Shorthands

Map short props to full names:

```tsx
shorthands: {
  p: 'padding',
  m: 'margin',
  bg: 'backgroundColor',
  w: 'width',
  h: 'height',
  px: 'paddingHorizontal',
  py: 'paddingVertical',
  mx: 'marginHorizontal',
  my: 'marginVertical',
  br: 'borderRadius',
} as const
```

Usage:
```tsx
<View p="$4" bg="$background" br="$2" />
```

## Settings

```tsx
settings: {
  defaultFont: 'body',
  shouldAddPrefersColorThemes: true,  // auto light/dark CSS
  allowedStyleValues: 'somewhat-strict-web',
  autocompleteSpecificTokens: 'except-special',
  onlyAllowShorthands: false,  // allow both short and long names
  mediaQueryDefaultActive: {
    // SSR: assume these queries are true initially
    gtSm: true,
    gtMd: true,
  },
}
```

## TypeScript Setup

Extend Tamagui types with your config:

```tsx
// tamagui.config.ts
const config = createTamagui({...})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config
```

## Provider Setup

```tsx
import { TamaguiProvider } from 'tamagui'
import config from './tamagui.config'

export default function App() {
  return (
    <TamaguiProvider config={config}>
      {/* app content */}
    </TamaguiProvider>
  )
}
```

## Getting Project Config

Run to generate project-specific reference:

```bash
npx tamagui generate-prompt
```

Creates `tamagui-prompt.md` with your actual tokens, themes, media queries, and components.
