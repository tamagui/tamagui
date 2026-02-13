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

These shorthands work automatically, even without configuration:

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
| `text` | color |

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

Non-Tailwind classes are preserved:

```tsx
<View className="my-custom-class bg-blue5 another-class text-center" />
// bg-blue5 is processed into styles
// my-custom-class, another-class, text-center are kept in className
```

## How It Works

1. className string is parsed into individual classes
2. Classes are checked against known style properties and shorthands
3. Only classes with valid prop-value patterns are processed (e.g., `bg-red`, `w-100`)
4. Classes like `my-custom-class` or `text-center` are preserved
5. Values are checked against your token config for auto-resolution
6. Modifiers like `hover:`, `sm:` are converted to Tamagui's style system

## Performance

- Zero runtime overhead for static values
- Same atomic CSS extraction as regular Tamagui
- Works with Tamagui compiler for optimal output
