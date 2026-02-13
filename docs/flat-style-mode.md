# Flat Style Mode

A new styling syntax for Tamagui that brings Tailwind-like ergonomics while keeping Tamagui's powerful theming and cross-platform capabilities.

## Overview

Flat mode introduces a cleaner prop-based syntax using `$` prefixed props with chainable modifiers. Instead of nested objects, styles are expressed as flat props that read left-to-right.

## Configuration

```tsx
import { createTamagui } from 'tamagui'

const config = createTamagui({
  // ... your config
  settings: {
    // Enable flat mode
    styleMode: 'flat',

    // Or enable multiple modes
    styleMode: ['flat', 'tailwind'],

    // Or use object syntax for fine control
    styleMode: {
      flat: true, // $hover:bg="red" syntax
      tailwind: true, // className="hover:bg-red" syntax
    },
  },
})
```

## Syntax Comparison

### Before (Object Syntax)

```tsx
<View
  backgroundColor="red"
  padding={20}
  hoverStyle={{ backgroundColor: 'blue' }}
  $sm={{ padding: 40 }}
  $theme-dark={{ backgroundColor: 'black' }}
/>
```

### After (Flat Syntax)

```tsx
<View $bg="red" $p={20} $hover:bg="blue" $sm:p={40} $dark:bg="black" />
```

## Flat Props

All style props can be prefixed with `$` for the flat syntax:

```tsx
// Base styles
$bg="red"              // backgroundColor
$p={20}                // padding
$m={10}                // margin
$w={100}               // width
$h={50}                // height
$rounded={8}           // borderRadius
$opacity={0.5}         // opacity

// Works with tokens
$bg="$blue5"           // uses $blue5 token
$p="$4"                // uses space token
```

## Modifiers

Chain modifiers with colons - they read naturally left-to-right:

### Pseudo States

```tsx
$hover:bg="blue"       // hoverStyle
$press:scale={0.98}    // pressStyle
$focus:borderColor="blue"
$disabled:opacity={0.5}
```

### Media Queries

```tsx
$sm:p={40}             // $sm media query
$md:flex={1}           // $md media query
$lg:display="flex"     // $lg media query
```

### Themes

```tsx
$dark: bg = 'black' // dark theme
$light: bg = 'white' // light theme
```

### Platform

```tsx
$web: cursor = 'pointer' // web only
$native: shadow = '$sm' // native only
```

### Combined Modifiers

```tsx
// Order doesn't matter - these are equivalent:
$sm: hover: bg = 'purple'
$hover: sm: bg = 'purple'

// Full combination
$sm: dark: hover: bg = 'gray'
```

## Tailwind className Mode

When `tailwind` mode is enabled, you can use className strings:

```tsx
<View className="w-100 h-50 bg-blue5 hover:bg-blue7 sm:p-4" />
```

This parses Tailwind-style class names and converts them to Tamagui styles:

- `w-100` → width: 100
- `bg-blue5` → backgroundColor: '$blue5' (auto-resolves to token)
- `hover:bg-blue7` → hoverStyle: { backgroundColor: '$blue7' }
- `sm:p-4` → $sm: { padding: '$4' }

### Token Auto-Resolution

Values automatically resolve to tokens when they match a token name:

```tsx
// These are equivalent:
<View className="bg-blue5" />      // auto-resolves to $blue5 token
<View className="bg-$blue5" />     // explicit token reference

// Raw CSS when no token matches:
<View className="bg-purple" />     // uses "purple" as raw CSS value
```

**Note:** Tailwind mode uses YOUR tokens, not Tailwind's default values. Values only become tokens if they match a token name in your config.

## Styled Components

Flat props work in styled() definitions (keys need quotes due to colons):

```tsx
const Button = styled(View, {
  $bg: '$blue5',
  $p: '$4',
  '$hover:bg': '$blue7',
  '$sm:p': '$6',
})
```

## Examples

### Interactive Button

```tsx
<View
  $bg="$blue5"
  $p="$4"
  $rounded="$2"
  $hover:bg="$blue7"
  $hover:scale={1.02}
  $press:scale={0.98}
  $disabled:opacity={0.5}
/>
```

### Responsive Card

```tsx
<View $bg="$background" $p="$4" $rounded="$4" $sm:p="$6" $md:p="$8" $dark:bg="$gray1" />
```

### Tailwind-style

```tsx
<View className="bg-blue5 p-4 rounded-2 hover:bg-blue7 sm:p-6" />
```

## Migration

Flat mode is opt-in and works alongside existing syntax. You can gradually migrate:

```tsx
// These work together in the same component
<View
  backgroundColor="red" // traditional
  $hover:bg="blue" // flat
  $sm={{ padding: 10 }} // object media
  $sm:m={20} // flat media
/>
```

## Type Safety

Full TypeScript support with autocomplete for:

- All style props with `$` prefix
- Modifier combinations
- Token values

```tsx
// TypeScript knows these are valid:
<View
  $bg="$blue5" // ✓ color token
  $hover:bg="$blue7" // ✓ pseudo + color
  $sm:p="$4" // ✓ media + space token
/>
```

## Performance

- Zero runtime overhead for static values
- Same atomic CSS extraction as traditional syntax
- Modifier parsing is cached
- Works with Tamagui compiler for optimal output
