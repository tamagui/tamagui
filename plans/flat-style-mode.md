# Flat Style Mode (`styleMode: 'flat'`)

## Overview

A new styling mode for Tamagui v6 that aligns with Tailwind's mental model. All style props are prefixed with `$`, and modifiers chain naturally.

## Syntax

### Basic Style Props

All style props get `$` prefix in flat mode:

```tsx
<View
  $bg="$blue5"
  $p="$4"
  $rounded="$2"
  $w="100%"
  $h="$10"
/>
```

### Modifiers (Tailwind-aligned)

Modifiers come BEFORE the prop (like Tailwind's `hover:bg-red`):

```tsx
<View
  $hover:bg="$blue7"
  $press:scale={0.98}
  $focus:outline="2px solid blue"
  $disabled:opacity={0.5}
/>
```

### Stacked Modifiers

Multiple modifiers chain left-to-right:

```tsx
<View
  $sm:bg="$blue5"           // responsive
  $sm:hover:bg="$blue7"     // responsive + state
  $dark:bg="$gray1"         // theme
  $dark:hover:bg="$gray3"   // theme + state
  $sm:dark:hover:bg="$purple5"  // all three
/>
```

### Full Example

```tsx
<View
  // Base styles
  $bg="$blue5"
  $p="$4"
  $rounded="$2"

  // Pseudo-states
  $hover:bg="$blue7"
  $hover:scale={1.02}
  $press:scale={0.98}
  $focus-visible:outline="2px solid $blue8"
  $disabled:opacity={0.5}

  // Responsive
  $sm:p="$6"
  $md:p="$8"
  $sm:hover:bg="$blue9"

  // Theme
  $dark:bg="$gray1"
  $dark:hover:bg="$gray3"

  // Structural (new)
  $first:mt="$0"
  $last:mb="$0"
  $odd:bg="$gray2"

  // Group
  $group-header:hover:opacity={1}

  // Platform
  $web:cursor="pointer"
  $native:shadow="$shadow.sm"

  // Non-style props (no $ prefix)
  onPress={handlePress}
  disabled={isDisabled}
  testID="my-view"
/>
```

## Modifier Categories

### Pseudo-States (Current)
- `hover` - mouse hover
- `press` - active/pressed (Tailwind: `active`)
- `focus` - focus state
- `focus-visible` - keyboard focus
- `focus-within` - focus within children
- `disabled` - disabled state
- `enter` - animation enter
- `exit` - animation exit

### Pseudo-States (New from Tailwind)
- `checked` - checkbox/radio checked
- `required` - required form field
- `valid` - valid form input
- `invalid` - invalid form input
- `placeholder-shown` - placeholder visible
- `autofill` - browser autofill
- `read-only` - read-only input

### Structural (New from Tailwind)
- `first` - first child
- `last` - last child
- `only` - only child
- `odd` - odd children
- `even` - even children
- `empty` - no children
- `first-of-type` - first of type
- `last-of-type` - last of type

### Pseudo-Elements (New from Tailwind)
- `before` - ::before
- `after` - ::after
- `placeholder` - ::placeholder
- `selection` - ::selection

### Responsive (V5 aligned)
- `xxxs` - 260px
- `xxs` - 340px
- `xs` - 460px
- `sm` - 640px (Tailwind match)
- `md` - 768px (Tailwind match)
- `lg` - 1024px (Tailwind match)
- `xl` - 1280px (Tailwind match)
- `xxl` - 1536px (Tailwind match)
- `max-*` variants for all

### Height Responsive (V5)
- `height-xxxs`, `height-xxs`, `height-xs`, `height-sm`, `height-md`, `height-lg`

### Theme
- `dark` - dark theme
- `light` - light theme
- Custom theme names

### Platform
- `web` - web only
- `native` - native only (iOS + Android)
- `ios` - iOS only
- `android` - Android only

### Motion/Accessibility (New from Tailwind)
- `motion-safe` - no reduced motion preference
- `motion-reduce` - reduced motion preferred
- `contrast-more` - high contrast preferred
- `contrast-less` - low contrast preferred

### Orientation (New from Tailwind)
- `portrait` - portrait orientation
- `landscape` - landscape orientation

### Pointer (V5 has pointerTouch)
- `pointer-fine` - mouse/stylus
- `pointer-coarse` - touch

### Group
- `group-{name}` - named group
- `group-{name}:hover` - group hover state
- `group-{name}:{media}` - group + responsive
- `group-{name}:{media}:hover` - all combined

### Peer (New from Tailwind)
- `peer-{name}` - sibling state
- `peer-{name}:checked` - sibling checked
- `peer-{name}:invalid` - sibling invalid

## Configuration

```tsx
import { createTamagui } from 'tamagui'

const config = createTamagui({
  // ... other config
  settings: {
    // Option 1: Simple mode selection
    styleMode: 'flat',

    // Option 2: Multiple modes (pick and choose)
    styleMode: ['tamagui', 'flat'],

    // Option 3: Object config with options
    styleMode: {
      tamagui: true,   // current object syntax ($sm={{ }}, hoverStyle={{ }})
      flat: true,      // flat prop syntax ($hover:bg="red")
      // IMPORTANT: tailwind mode does NOT hardcode Tailwind's color/spacing system.
      // Users configure their own tokens. This just enables className with modifier syntax.
      // We are NOT implementing every Tailwind utility - just the modifier syntax alignment.
      tailwind: true,  // className="hover:bg-red-500" (users define their own tokens)
    },
  }
})
```

### Flat Mode Variants

```tsx
// flat: 'values' - value as prop value (default)
<View $hover:bg="$blue5" $hover:bg={dynamicColor} />

// flat: 'props' - value baked into prop name (Tailwind-like)
<View $hover:bg-blue5 />  // static tokens only

// Both can coexist - parser detects:
// - Has = value? Use the value
// - No value / boolean? Parse value from prop name
```

## Tokens

Token syntax unchanged - use `$` prefix for token values:

```tsx
$bg="$blue5"      // token
$bg="blue"        // literal (if allowed)
$bg="#0000ff"     // literal
$p="$4"           // space token
$rounded="$2"     // radius token
```

## styled() Usage

In styled(), keys need quotes due to colons:

```tsx
const MyComponent = styled(View, {
  '$bg': '$blue5',
  '$hover:bg': '$blue7',
  '$sm:p': '$6',
  '$sm:hover:bg': '$blue9',
})
```

## Migration

Flat mode is opt-in via `styleMode: 'flat'`. Existing syntax continues to work.

Codemod can convert:
- `bg="red"` → `$bg="red"`
- `hoverStyle={{ bg: 'red' }}` → `$hover:bg="red"`
- `$sm={{ bg: 'red' }}` → `$sm:bg="red"`
- `$sm={{ hoverStyle: { bg: 'red' }}}` → `$sm:hover:bg="red"`

## Implementation Considerations

### Parsing
- Props starting with `$` are style props
- Split on `:` to get modifier chain + final prop name
- Last segment is the prop, everything before are modifiers
- Modifiers are validated against known list

### Type System
- Need new prop types for `$${Prop}` pattern
- Need modifier combination types
- Template literal types for `$${Modifier}:${Prop}`

### Ordering
- Modifiers apply in specificity order
- Later in chain = higher specificity
- `$sm:hover:bg` > `$sm:bg` > `$hover:bg` > `$bg`

### Performance
- Prop parsing at runtime (or compile-time with Tamagui compiler)
- Cache parsed modifier chains
- Compiler can optimize to current internal format
