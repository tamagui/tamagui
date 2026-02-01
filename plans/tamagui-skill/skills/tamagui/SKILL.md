---
name: tamagui
description: |
  Universal React UI framework for web and native. Use when building cross-platform apps with Tamagui,
  creating styled components with `styled()`, configuring design tokens/themes, using Tamagui UI components,
  or working with animations. Triggers: "tamagui", "styled()", "$token", "XStack/YStack", "useTheme",
  "@tamagui/*" imports, "createStyledContext", "variants".
version: 1.0.0
---

# Tamagui Skill

Universal React UI framework for web and native with an optimizing compiler.

## Getting Project-Specific Config

**Before writing Tamagui code**, get the project's actual configuration:

```bash
npx tamagui generate-prompt
```

This outputs `tamagui-prompt.md` with the project's specific:
- Design tokens (space, size, radius, color, zIndex)
- Theme names and hierarchy
- Available components
- Media query breakpoints
- Shorthand properties
- Font families

**Always reference this file for token/theme/media query names** rather than guessing or using defaults.

---

## Core Concepts

### styled() Function

Create components by extending existing ones:

```tsx
import { View, Text, styled } from '@tamagui/core'

const Card = styled(View, {
  padding: '$4',           // use tokens with $
  backgroundColor: '$background',
  borderRadius: '$4',

  variants: {
    size: {
      small: { padding: '$2' },
      large: { padding: '$6' },
    },
    elevated: {
      true: {
        shadowColor: '$shadowColor',
        shadowRadius: 10,
      },
    },
  } as const,  // required for type inference

  defaultVariants: {
    size: 'small',
  },
})

// usage
<Card size="large" elevated />
```

**Key rules:**
- Always use `as const` on variants objects
- Tokens use `$` prefix: `$4`, `$background`, `$color11`
- Prop order matters - later props override earlier ones
- Variants defined later in the object override earlier ones

### Stack Components

```tsx
import { XStack, YStack, ZStack } from 'tamagui'

// XStack = flexDirection: 'row'
// YStack = flexDirection: 'column'
// ZStack = position: 'relative' with absolute children

<YStack gap="$4" padding="$4">
  <XStack justifyContent="space-between" alignItems="center">
    <Text>Label</Text>
    <Button>Action</Button>
  </XStack>
</YStack>
```

### Themes

Themes nest and combine hierarchically:

```tsx
import { Theme } from 'tamagui'

// base theme
<Theme name="dark">
  {/* sub-theme */}
  <Theme name="blue">
    {/* uses dark_blue theme */}
    <Button>Blue button on dark</Button>
  </Theme>
</Theme>

// access theme values
const theme = useTheme()
console.log(theme.background.val)  // actual color value
console.log(theme.color11.val)     // high contrast text
```

**12-step color scale convention:**
- `$color1-4`: backgrounds (subtle to emphasized)
- `$color5-6`: borders, separators
- `$color7-8`: hover/active states
- `$color9-10`: solid backgrounds
- `$color11-12`: text (low to high contrast)

### Responsive Styles

Use media query props (check your `tamagui-prompt.md` for actual breakpoint names):

```tsx
<YStack
  padding="$4"
  $gtSm={{ padding: '$6' }}   // check your config for actual names
  $gtMd={{ padding: '$8' }}
  flexDirection="column"
  $gtLg={{ flexDirection: 'row' }}
/>

// or with hook
const media = useMedia()
if (media.gtMd) {
  // render for medium+ screens
}
```

### Animations

```tsx
import { AnimatePresence } from 'tamagui'

<AnimatePresence>
  {show && (
    <YStack
      key="modal"  // key required for exit animations
      animation="quick"
      enterStyle={{ opacity: 0, y: -20 }}
      exitStyle={{ opacity: 0, y: 20 }}
      opacity={1}
      y={0}
    />
  )}
</AnimatePresence>
```

**Animation drivers:**
- `@tamagui/animations-css` - web only, CSS transitions
- `@tamagui/animations-react-native` - native Animated API
- `@tamagui/animations-reanimated` - best native performance
- `@tamagui/animations-motion` - spring physics

CSS driver uses easing strings, others support spring physics.

---

## Compound Components

Use `createStyledContext` for components that share state:

```tsx
import { createStyledContext, styled, View, Text } from '@tamagui/core'
import { withStaticProperties } from '@tamagui/helpers'

const CardContext = createStyledContext({ size: 'medium' as 'small' | 'medium' | 'large' })

const CardFrame = styled(View, {
  context: CardContext,
  padding: '$4',
  backgroundColor: '$background',

  variants: {
    size: {
      small: { padding: '$2' },
      medium: { padding: '$4' },
      large: { padding: '$6' },
    },
  } as const,
})

const CardTitle = styled(Text, {
  context: CardContext,  // inherits size from parent
  fontWeight: 'bold',

  variants: {
    size: {
      small: { fontSize: '$4' },
      medium: { fontSize: '$5' },
      large: { fontSize: '$6' },
    },
  } as const,
})

export const Card = withStaticProperties(CardFrame, {
  Title: CardTitle,
})

// usage - size cascades to children
<Card size="large">
  <Card.Title>Large Title</Card.Title>
</Card>
```

---

## Common Patterns

### Dialog with Adapt (Sheet on Mobile)

```tsx
import { Dialog, Sheet, Adapt, Button } from 'tamagui'

<Dialog>
  <Dialog.Trigger asChild>
    <Button>Open</Button>
  </Dialog.Trigger>

  <Adapt when="sm" platform="touch">
    <Sheet modal dismissOnSnapToBottom>
      <Sheet.Frame padding="$4">
        <Adapt.Contents />
      </Sheet.Frame>
      <Sheet.Overlay />
    </Sheet>
  </Adapt>

  <Dialog.Portal>
    <Dialog.Overlay
      key="overlay"
      animation="quick"
      opacity={0.5}
      enterStyle={{ opacity: 0 }}
      exitStyle={{ opacity: 0 }}
    />
    <Dialog.Content
      key="content"
      animation="quick"
      enterStyle={{ opacity: 0, scale: 0.95 }}
      exitStyle={{ opacity: 0, scale: 0.95 }}
    >
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
      <Dialog.Close asChild>
        <Button>Close</Button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog>
```

### Form with Input/Label

```tsx
import { Input, Label, YStack, XStack, Button } from 'tamagui'

<YStack gap="$4" padding="$4">
  <YStack gap="$2">
    <Label htmlFor="email">Email</Label>
    <Input
      id="email"
      placeholder="email@example.com"
      autoCapitalize="none"
      keyboardType="email-address"
    />
  </YStack>

  <XStack gap="$2" justifyContent="flex-end">
    <Button variant="outlined">Cancel</Button>
    <Button theme="blue">Submit</Button>
  </XStack>
</YStack>
```

---

## Anti-Patterns

### ❌ Hardcoded values instead of tokens

```tsx
// bad
<View padding={16} backgroundColor="#fff" />

// good - uses design tokens
<View padding="$4" backgroundColor="$background" />
```

### ❌ Missing `as const` on variants

```tsx
// bad - TypeScript can't infer variant types
variants: {
  size: { small: {...}, large: {...} }
}

// good
variants: {
  size: { small: {...}, large: {...} }
} as const
```

### ❌ Platform detection in styled()

```tsx
// bad - won't be extracted by compiler
const Box = styled(View, {
  padding: Platform.OS === 'web' ? 10 : 20,
})

// good - use platform modifiers
const Box = styled(View, {
  padding: 20,
  '$platform-web': { padding: 10 },
})
```

### ❌ exitStyle without AnimatePresence

```tsx
// bad - exit animation won't work
{show && <View exitStyle={{ opacity: 0 }} />}

// good
<AnimatePresence>
  {show && <View key="box" exitStyle={{ opacity: 0 }} />}
</AnimatePresence>
```

### ❌ Dynamic values that prevent extraction

```tsx
// bad - runtime variable prevents compiler extraction
const dynamicPadding = isPremium ? '$6' : '$4'
<View padding={dynamicPadding} />

// good - inline ternary is extractable
<View padding={isPremium ? '$6' : '$4'} />
```

### ❌ Wrong media query order

```tsx
// bad - base value overrides responsive
<View $gtMd={{ padding: '$8' }} padding="$4" />

// good - base first, then responsive overrides
<View padding="$4" $gtMd={{ padding: '$8' }} />
```

### ❌ Spring animations with CSS driver

```tsx
// bad - CSS driver doesn't support spring physics
import { createAnimations } from '@tamagui/animations-css'
const anims = createAnimations({
  bouncy: { type: 'spring', damping: 10 }  // won't work
})

// good for CSS driver - use easing strings
const anims = createAnimations({
  bouncy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55) 300ms'
})
```

---

## Compiler Optimization

The Tamagui compiler extracts static styles to CSS at build time. For styles to be extracted:

1. **Use tokens** - `$4` extracts, `16` may not
2. **Inline ternaries** - `padding={x ? '$4' : '$2'}` extracts
3. **Avoid runtime variables** - computed values don't extract
4. **Use variants** - better than conditional props

Check if extraction is working:
- Look for `data-tamagui` attributes in dev mode
- Bundle size should be smaller with compiler enabled
- Styles should appear as CSS classes, not inline

---

## TypeScript

```tsx
import { GetProps, styled, View } from '@tamagui/core'

const MyComponent = styled(View, {
  variants: {
    size: { small: {}, large: {} }
  } as const,
})

// extract props type
type MyComponentProps = GetProps<typeof MyComponent>

// extend with custom props
interface ExtendedProps extends MyComponentProps {
  onCustomEvent?: () => void
}
```

---

## Quick Reference

| Pattern | Example |
|---------|---------|
| Token | `padding="$4"` |
| Theme value | `backgroundColor="$background"` |
| Color scale | `color="$color11"` (high contrast text) |
| Responsive | `$gtSm={{ padding: '$6' }}` |
| Variant | `<Button size="large" variant="outlined" />` |
| Animation | `animation="quick" enterStyle={{ opacity: 0 }}` |
| Theme switch | `<Theme name="dark"><Theme name="blue">` |
| Compound | `<Card><Card.Title>` with `createStyledContext` |

---

## Resources

- Docs: https://tamagui.dev
- GitHub: https://github.com/tamagui/tamagui
- Discord: https://discord.gg/tamagui
