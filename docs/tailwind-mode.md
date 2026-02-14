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
<View className="my-custom-class bg-blue5 another-class text-center" />
// Result:
// - bg-blue5 → converted to backgroundColor style
// - my-custom-class, another-class, text-center → preserved in className
```

### What Gets Processed

A class is processed as Tailwind syntax when:
1. It has a known prop prefix (e.g., `bg-`, `p-`, `w-`)
2. The value is valid (numeric, token reference, or simple CSS value)

### What Gets Preserved

These are kept as regular CSS classes:
- Classes without dashes: `container`, `flex`
- Classes with unknown props: `my-custom-class`, `foo-bar`
- Classes with invalid values: `my-theme` (not a valid spacing value)
- Ambiguous classes: `text-center` (could mean text-align, not color)

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
