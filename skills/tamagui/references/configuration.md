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

For most projects, start with the v6 default config. It ships Tailwind-aligned
scales (space/size `'4'` = 16), Tailwind-named color tokens (`blue-500`),
Tailwind-style media keys (`sm`/`max-sm`), and the v6 shorthands. It bundles no
animations; add a driver preset from a sub-entry:

```tsx
import { createTamagui } from '@tamagui/core'
import { defaultConfig } from '@tamagui/config/v6'
import { animationsCSS } from '@tamagui/config/animations-css'
// or: animations-rn / animations-reanimated / animations-motion

export default createTamagui({
  ...defaultConfig,
  animations: animationsCSS,
})
```

`@tamagui/config/v5` still exists for apps that have not moved to the v6
scales, but new projects should use v6.

## Tokens

Design system values. In flat values, a quoted string binds config-first: the
value looks up the token scale for that property's category before falling
back to CSS:

```tsx
tokens: {
  color: {
    white: '#fff',
    black: '#000',
    brand: '#0066cc',
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
<View padding="4" borderRadius="2" />
```

The v6 default tokens follow Tailwind: `space`/`size` use the Tailwind spacing
scale (`'4'` = 16px), `radius` has numeric steps 0-12 plus the Tailwind names,
and colors are the Tailwind palette (`gray-100` ... `blue-500` ... `red-950`).

## Themes

Define color schemes with semantic names. The v6 generated themes expose
`background`, `color`, the `color1`-`color11` ramp, and hyphenated state keys:

```tsx
themes: {
  light: {
    background: '#fff',
    'background-hover': '#f8f8f8',
    'background-press': '#f0f0f0',
    color: '#000',
    color1: '#f8f8f8',
    color2: '#f0f0f0',
    // ... color3-11
    'border-color': '#e0e0e0',
    'shadow-color': 'rgba(0,0,0,0.12)',
    'accent-background': '#0066cc',
    'accent-color': '#fff',
  },
  dark: {
    background: '#000',
    color: '#fff',
    // ...
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
  <View backgroundColor="background" />
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
<Text fontFamily="body" fontSize="4" />
```

## Media Queries

The v6 media keys are Tailwind-style: bare names are min-width (mobile-first),
`max-*` names are max-width, plus capability queries:

```tsx
media: {
  // mobile-first min-width (v6 breakpoints: sm 640, md 768, lg 1024, xl 1280)
  sm: { minWidth: 640 },
  md: { minWidth: 768 },
  lg: { minWidth: 1024 },
  xl: { minWidth: 1280 },
  // desktop-first max-width
  'max-sm': { maxWidth: 639.98 },
  'max-md': { maxWidth: 767.98 },
  // capability queries: touchable is always true on native, hoverable always false
  touchable: { pointer: 'coarse' },
  hoverable: { hover: 'hover' },
}
```

Usage (clauses prefix the value, base first):
```tsx
<View padding="4 sm:6 md:8" />
<View display="none max-sm:flex" />
```

## Shorthands

The v6 shorthands are Tailwind-aligned. Notable: `bg` maps to `background`
(not backgroundColor), and the flex-alignment names drop the `align`/`justify`
prefixes:

```tsx
import { shorthands } from '@tamagui/shorthands/v6'

// the full v6 set:
// text: textAlign          items: alignItems       justify: justifyContent
// self: alignSelf          content: alignContent   grow: flexGrow
// shrink: flexShrink       bg: background          rounded: borderRadius
// select: userSelect       z: zIndex
// p pt pr pb pl px py: padding*      m mt mr mb ml mx my: margin*
// w h maxW maxH minW minH: sizes     t r b l: top/right/bottom/left
```

Usage:
```tsx
<View p="4" bg="background" rounded="2" items="center" justify="space-between" />
```

## Settings

```tsx
settings: {
  defaultFont: 'body',
  shouldAddPrefersColorThemes: true,  // auto light/dark CSS
  allowedStyleValues: 'somewhat-strict-web',
  onlyAllowShorthands: false,  // allow both short and long names
  mediaQueryDefaultActive: {
    // SSR: assume these queries are true initially (v6 sets this for you)
    'max-md': true,
    'max-sm': true,
    xs: true,
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
