# Tamagui Tailwind Mode

Use Tailwind-style className strings with Tamagui's design tokens and theming.

## Quick Start

```tsx
import { View } from 'tamagui'

// Tailwind-style className syntax
<View className="bg-blue5 p-4 rounded-2 hover:bg-blue7 sm:p-6" />
```

## Configuration

Enable tailwind mode in your Tamagui config:

```tsx
import { createTamagui } from 'tamagui'

const config = createTamagui({
  // ... your config
  settings: {
    styleMode: 'tailwind',
  },
})
```

## Syntax

### Basic Classes

```tsx
<View className="w-100 h-50 bg-red p-4 m-2 rounded-8" />
```

| Class | CSS Property |
|-------|--------------|
| `w-100` | width: 100px |
| `h-50` | height: 50px |
| `bg-red` | backgroundColor: 'red' |
| `p-4` | padding: 4px |
| `m-2` | margin: 2px |
| `rounded-8` | borderRadius: 8px |
| `opacity-50` | opacity: 0.5 |

### Token Auto-Resolution

Values automatically resolve to tokens when they match a token name:

```tsx
// These are equivalent:
<View className="bg-blue5" />      // auto-resolves to $blue5 token
<View className="bg-$blue5" />     // explicit token reference

// Raw CSS when no token matches:
<View className="bg-purple" />     // uses "purple" as raw CSS value
```

#### The container scale is width-only

Tailwind's `--container-*` scale (`3xs` through `7xl`, 256px to 1280px) is a
reading-width scale. `max-w-3xl` is a utility; `h-3xl` is not. The v6 config
follows that exactly: `width`, `minWidth`, `maxWidth`, `inlineSize`,
`minInlineSize`, `maxInlineSize` and `flexBasis` carry the container scale, and
no height or block-size domain does.

That shows up in two places:

```tsx
// className: h-3xl is not a Tailwind utility, so it stays a raw class and
// contributes no height at all
<View className="w-3xl h-3xl" />   // width: 768, no height

// props: width finds the container scale, height falls back to the shared
// `size` scale, which has no 3xl, so the value stays unresolved
<View width="$3xl" />              // 768
<View height="$3xl" />             // unresolved, no height applied
```

For a vertical dimension at a container size, write the value
(`height={768}`) or add your own `height` token group in your config.

### Modifiers

#### Hover & Press States

```tsx
<View className="bg-blue5 hover:bg-blue7 press:bg-blue8" />
```

#### Media Queries

```tsx
<View className="p-2 sm:p-4 md:p-6 lg:p-8" />
```

#### Theme Variants

```tsx
<View className="bg-white dark:bg-black" />
```

#### Combined Modifiers

```tsx
<View className="bg-gray sm:hover:bg-blue" />
```

## Built-in Shorthands

These shorthands work automatically:

| Shorthand | Property |
|-----------|----------|
| `w` | width |
| `h` | height |
| `bg` | backgroundColor |
| `p` | padding |
| `pt`, `pr`, `pb`, `pl` | paddingTop, paddingRight, paddingBottom, paddingLeft |
| `px`, `py` | paddingHorizontal, paddingVertical |
| `m` | margin |
| `mt`, `mr`, `mb`, `ml` | marginTop, marginRight, marginBottom, marginLeft |
| `mx`, `my` | marginHorizontal, marginVertical |
| `rounded` | borderRadius |
| `border` | borderWidth |

Your configured shorthands are also available.

## Examples

### Interactive Button

```tsx
<View className="bg-blue5 p-4 rounded-2 hover:bg-blue7 press:scale-98" />
```

### Responsive Card

```tsx
<View className="bg-background p-4 rounded-4 sm:p-6 md:p-8 dark:bg-gray1" />
```

### Complex Component

```tsx
<View className="w-full h-auto bg-white p-4 rounded-8 border-1 hover:bg-gray1 sm:p-6 dark:bg-black dark:border-gray8" />
```

## Mixed with Regular Props

Tailwind classes work alongside regular Tamagui props:

```tsx
<View
  className="bg-blue5 hover:bg-blue7"
  animation="quick"
  onPress={handlePress}
/>
```

## Class Preservation

Only recognized Tailwind-style classes are processed. All other classes are preserved:

```tsx
<View className="my-custom-class bg-blue5 another-class grid-cols-3" />
// Result:
// - bg-blue5 → converted to backgroundColor style
// - my-custom-class, another-class, grid-cols-3 → preserved in className (web)
```

### What Gets Processed

A class is processed as Tailwind syntax when the shared grammar can prove it: a known prefix plus a configured token, enum, or arbitrary value. That includes:

- layout and spacing: `w-24`, `h-8`, `size-10`, `p-4`, `px-6`, `gap-2`
- flex and alignment: `flex`, `flex-row`, `items-center`, `justify-between`
- typography: `text-sm` (size), `text-white` (color), `text-center` (align), `text-[14px]`, `font-bold`, `font-sans`
- color, radius, and borders: `bg-blue5`, `rounded-t-xl`, `rounded-tl-lg`, `border-t-4`, `border-x`
- position: `inset-0`, `inset-x-0`, `inset-y-4`, `top-2`, `z-10`

`text-*` is disambiguated the same way Tailwind does it: alignment keywords, then the type scale, then palette and theme colors.

### What Gets Preserved

These stay as regular CSS classes on web (and are dropped on native):
- Unknown prefixes: `my-custom-class`, `grid-cols-3`, `float-right`
- Values the grammar cannot prove against the active config
- Web-only CSS with no React Native equivalent (see Coverage below)

## Coverage

Claimed utilities compile on web and native through the same grammar. The official Tailwind engine only sees passthrough classes.

Web-only remainder (passthrough, not a Tamagui miss that we can express cross-platform):

- CSS grid, columns, float, clear
- backdrop filters, mix-blend, CSS filter/blur
- sibling combinators (`space-x`, `divide-x`)
- outline, cursor, user-select, appearance, placeholder, file inputs
- gradient stops (`from-` / `via-` / `to-`), ring as extra box-shadow layers
- selector variants the grammar does not own (`data-*`, `[&>*]`, `peer-*`, `has-*`)

See `plans/v3-beta/tailwind-coverage.md` for the reason each of those stays passthrough.

## How It Works

1. className string is split into individual classes
2. Each class is checked against known shorthands and style props
3. Classes with valid prop-value patterns are converted to flat props
4. Unrecognized classes are preserved in the final className
5. Token values are auto-resolved when they match your config
6. Modifiers (`hover:`, `sm:`, `dark:`) wrap styles appropriately

## Value Validation

For spacing/sizing props (`w`, `h`, `m`, `p`, etc.), values must be:
- Numeric: `w-100`, `p-4`
- Token references: `p-$4`, `m-$spacing`

This prevents false matches like `my-custom-class` being parsed as `marginVertical: custom-class`.

For color props (`bg`, `color`), values can also be:
- CSS color names: `bg-red`, `bg-purple`
- Color variants: `bg-blue-500`
