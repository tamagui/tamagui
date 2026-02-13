# Tamagui Flat Mode

A cleaner prop-based syntax using `$` prefixed props with chainable modifiers.

## Quick Start

```tsx
import { View } from 'tamagui'

// Flat mode syntax
<View
  $bg="$blue5"
  $p="$4"
  $hover:bg="$blue7"
  $sm:p="$6"
/>
```

## Configuration

Enable flat mode in your Tamagui config:

```tsx
import { createTamagui } from 'tamagui'

const config = createTamagui({
  // ... your config
  settings: {
    styleMode: 'flat',
  },
})
```

Or enable both flat and tailwind modes:

```tsx
settings: {
  styleMode: ['flat', 'tailwind'],
}
```

## Syntax

### Base Props

All style props can be prefixed with `$`:

```tsx
<View
  $bg="red"
  $p={20}
  $m={10}
  $w={100}
  $h={50}
  $rounded={8}
  $opacity={0.5}
/>
```

### With Tokens

```tsx
<View
  $bg="$blue5"
  $p="$4"
  $color="$gray12"
/>
```

## Modifiers

Chain modifiers with colons - they read naturally left-to-right.

### Pseudo States

```tsx
<View
  $hover:bg="$blue7"
  $press:scale={0.98}
  $focus:borderColor="$blue8"
  $disabled:opacity={0.5}
/>
```

### Media Queries

```tsx
<View
  $sm:p="$6"
  $md:flex={1}
  $lg:display="flex"
/>
```

### Themes

```tsx
<View
  $dark:bg="black"
  $light:bg="white"
/>
```

### Platform

```tsx
<View
  $web:cursor="pointer"
  $native:shadow="$sm"
/>
```

### Combined Modifiers

Order doesn't matter - these are equivalent:

```tsx
<View $sm:hover:bg="purple" />
<View $hover:sm:bg="purple" />
```

Full combination:

```tsx
<View $sm:dark:hover:bg="$gray8" />
```

## Comparison

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
<View
  $bg="red"
  $p={20}
  $hover:bg="blue"
  $sm:p={40}
  $dark:bg="black"
/>
```

## Styled Components

Flat props work in styled() definitions (keys need quotes due to colons):

```tsx
const Button = styled(View, {
  '$bg': '$blue5',
  '$p': '$4',
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
<View
  $bg="$background"
  $p="$4"
  $rounded="$4"
  $sm:p="$6"
  $md:p="$8"
  $dark:bg="$gray1"
/>
```

### Complex Layout

```tsx
<View
  $w="100%"
  $h="auto"
  $bg="$background"
  $p="$4"
  $rounded="$4"
  $borderWidth={1}
  $borderColor="$borderColor"
  $hover:borderColor="$blue8"
  $sm:p="$6"
  $dark:bg="$gray2"
/>
```

## Migration

Flat mode is opt-in and works alongside existing syntax:

```tsx
// These work together in the same component
<View
  backgroundColor="red"     // traditional
  $hover:bg="blue"          // flat
  $sm={{ padding: 10 }}     // object media
  $sm:m={20}                // flat media
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
  $bg="$blue5"           // ✓ color token
  $hover:bg="$blue7"     // ✓ pseudo + color
  $sm:p="$4"             // ✓ media + space token
/>
```

## Performance

- Zero runtime overhead for static values
- Same atomic CSS extraction as traditional syntax
- Modifier parsing is cached
- Works with Tamagui compiler for optimal output

## Shorthands

Flat mode uses your configured shorthands:

```tsx
// If your config has these shorthands:
// bg -> backgroundColor
// p -> padding
// m -> margin

<View $bg="red" $p={10} $m={5} />
```

Standard shorthands also work:

| Shorthand | Property |
|-----------|----------|
| `$bg` | backgroundColor |
| `$p` | padding |
| `$m` | margin |
| `$w` | width |
| `$h` | height |
| `$rounded` | borderRadius |
| `$opacity` | opacity |
| `$color` | color |
