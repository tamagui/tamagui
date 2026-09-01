---
name: tamagui
description: |
  Universal React UI framework for web and native. Use when building cross-platform apps with Tamagui,
  creating styled components with `styled()`, configuring design tokens/themes, using Tamagui UI components,
  or working with animations. Triggers: "tamagui", "styled()", "flat value", "XStack/YStack", "useTheme",
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
  padding: '4',           // token names are bare
  backgroundColor: 'background',
  borderRadius: '4',

  variants: {
    size: {
      small: { padding: '2' },
      large: { padding: '6' },
    },
    elevated: {
      true: {
        shadowColor: 'shadow-color',
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
- Tokens and theme values are bare: `4`, `background`, `color11`
- Conditions are clauses in the same value string: `bg="background hover:background-hover"`
- Do not author pseudo, media, theme, platform, group, enter, or exit style objects
- Prop order matters: later props override earlier ones
- Variants defined later in the object override earlier ones

### Dynamic Variants and Component Resolvers

Use `styled.dynamic` and `.resolve` for typed dynamic styles:

```tsx
import { SizeTokens, View, style, styled } from 'tamagui'

// 1. Style piece: static fragment compiled at module evaluation
const activePiece = style({
  backgroundColor: 'background-press',
})

// 2. Dynamic variant: value -> style fragment, or bare declaration
const Box = styled(View, {
  variants: {
    // bare declaration: typed and consumed, styled in .resolve
    tone: styled.dynamic<'neutral' | 'critical'>(),

    // function form: maps value to styles, runs per clause payload
    size: styled.dynamic<SizeTokens | number>((val, { tokens }) => {
      const value = tokens.size[val] ?? val
      return { width: value, height: value }
    }),
  } as const,
}).resolve((props, env) => ({
  // 3. Component resolver: complete props -> styles
  backgroundColor: props.tone === 'critical' ? env.theme.red10 : undefined,
  opacity: props.disabled ? 0.5 : undefined,
}))
```

**Precedence tiers:**
`0 base styles < 1 variants < 2 component resolvers < 3 callsite style props < 4 style prop`

### Piece-Typed Component Props

Components accept `StylePiece` on dedicated style props:
- `activeStyle` on `Checkbox`, `ToggleGroup.Item`, and `Tabs.Tab`
- `contentContainerStyle` on `ScrollView`

```tsx
const contentStyle = style({ padding: 16 })
<ScrollView contentContainerStyle={contentStyle}>
  <Checkbox activeStyle={activePiece} />
</ScrollView>
```

### Tamagui Tailwind

Author with Tailwind utility classes in `className` by importing from `@tamagui/tailwind`:

```tsx
import { Text, View, styled } from '@tamagui/tailwind'

export function Card() {
  return (
    <View className="flex flex-row items-center gap-3 p-4 rounded-lg bg-slate-100">
      <View className="w-10 h-10 rounded-full bg-blue-500" />
      <Text className="text-base font-semibold text-slate-900">Card Title</Text>
    </View>
  )
}
```

- **Frontend selected by import:** No global mode. `@tamagui/tailwind` and `tamagui` components mix in the same tree.
- **Cross-platform:** Compiles to atomic CSS on web; resolves to React Native styles on iOS and Android.
- **Class-first styled():** `styled(View, 'p-4 rounded', { variants: { ... } })`
- **Vite plugin:** `import { tamaguiPlugin } from '@tamagui/tailwind/vite'`

### Stack Components

```tsx
import { XStack, YStack, ZStack } from 'tamagui'

// XStack = flexDirection: 'row'
// YStack = flexDirection: 'column'
// ZStack = position: 'relative' with absolute children

<YStack gap="4" padding="4">
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
- `color1-4`: backgrounds (subtle to emphasized)
- `color5-6`: borders, separators
- `color7-8`: hover/active states
- `color9-10`: solid backgrounds
- `color11-12`: text (low to high contrast)

### Responsive Styles

The v6 defaults use Tailwind-style, mobile-first keys: `sm:` is min-width,
`max-sm:` is max-width, plus `touchable`/`hoverable` capability keys (check
`tamagui-prompt.md` for the project's actual keys):

```tsx
<YStack
  padding="4 sm:6 md:8"
  flexDirection="column lg:row"
/>

// hook only for render logic, never for styles
const media = useMedia()
if (media.md) {
  // render a different tree for medium+ screens
}
```

Prefer media clauses in values for styling; reach for `useMedia()` only when
the rendered tree itself changes.

### Animations

```tsx
import { AnimatePresence } from 'tamagui'

<AnimatePresence>
  {show && (
    <YStack
      key="modal"  // key required for exit animations
      transition="quick"
      opacity="1 enter:0 exit:0"
      y="0 enter:-20px exit:20px"
    />
  )}
</AnimatePresence>
```

The prop is `transition` in v2+ (`animation` is the removed v1 name).

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
  padding: '4',
  backgroundColor: 'background',

  variants: {
    size: {
      small: { padding: '2' },
      medium: { padding: '4' },
      large: { padding: '6' },
    },
  } as const,
})

const CardTitle = styled(Text, {
  context: CardContext,  // inherits size from parent
  fontWeight: 'bold',

  variants: {
    size: {
      small: { fontSize: '4' },
      medium: { fontSize: '5' },
      large: { fontSize: '6' },
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

  <Adapt when="max-sm" platform="touch">
    <Sheet modal dismissOnSnapToBottom>
      <Sheet.Overlay />
      <Sheet.Container padding="4">
        <Sheet.Background />
        <Adapt.Contents />
      </Sheet.Container>
    </Sheet>
  </Adapt>

  <Dialog.Portal>
    <Dialog.Overlay
      key="overlay"
      transition="quick"
      opacity="0.5 enter:0 exit:0"
    />
    <Dialog.Content
      key="content"
      transition="quick"
      opacity="1 enter:0 exit:0"
      scale="1 enter:0.95 exit:0.95"
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

<YStack gap="4" padding="4">
  <YStack gap="2">
    <Label htmlFor="email">Email</Label>
    <Input
      id="email"
      placeholder="email@example.com"
      autoCapitalize="none"
      keyboardType="email-address"
    />
  </YStack>

  <XStack gap="2" justifyContent="flex-end">
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
<View padding="4" backgroundColor="background" />
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
  padding: '20px web:10px',
})
```

### ❌ Exit clause without AnimatePresence

```tsx
// bad - exit animation won't work
{show && <View opacity="1 exit:0" />}

// good
<AnimatePresence>
  {show && <View key="box" opacity="1 exit:0" />}
</AnimatePresence>
```

### ❌ Dynamic values that prevent extraction

```tsx
// bad - runtime variable prevents compiler extraction
const dynamicPadding = isPremium ? '6' : '4'
<View padding={dynamicPadding} />

// good - inline ternary is extractable
<View padding={isPremium ? '6' : '4'} />
```

### ❌ Wrong media query order

```tsx
// bad - base value overrides responsive
<View padding="gtMd:8 4" />

// good - base first, then responsive overrides
<View padding="4 gtMd:8" />
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

### ❌ Reading sibling props inside dynamic variants

```tsx
// bad - dynamic variant callbacks receive only (value, env)
const BadButton = styled(View, {
  variants: {
    size: styled.dynamic<SizeTokens>((val, env) => ({
      width: env.tokens.size[val],
      borderRadius: (env as any).props?.circular ? 1000 : 4,
    })),
  },
})

// good - declare bare dynamic variant, resolve sibling logic in .resolve
const GoodButtonBase = styled(View, {
  variants: {
    size: styled.dynamic<SizeTokens>((val, { tokens }) => ({
      width: tokens.size[val],
    })),
    circular: styled.dynamic<boolean>(),
  },
})

export const GoodButton = GoodButtonBase.resolve((props) => ({
  borderRadius: props.circular ? 1000 : 4,
}))
```

### ❌ Spreads or computed keys in dynamic bodies

```tsx
// bad - deopts compiler extraction and warns in development
const badVariant = styled.dynamic<string>((val) => ({
  [`padding-${val}`]: 10,
  ...someObject,
}))

// good - static keys and undefined values for inactive branches
const goodVariant = styled.dynamic<string>((val) => ({
  padding: val === 'large' ? 20 : 10,
  opacity: val === 'hidden' ? 0 : undefined,
}))
```

### ❌ Calling style() inside render

```tsx
// bad - recompiles style rules on every render pass
function BadComponent() {
  const badPiece = style({ padding: 16 })
  return <View style={badPiece} />
}

// good - define style pieces at module scope
const goodPiece = style({ padding: 16 })

function GoodComponent() {
  return <View style={goodPiece} />
}
```

---

## Compiler Optimization

The Tamagui compiler extracts static styles to CSS at build time. For styles to be extracted:

1. **Use bare tokens** - `4` extracts, `16` may not
2. **Inline ternaries** - `padding={x ? '4' : '2'}` extracts
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
| Token | `padding="4"` |
| Theme value | `backgroundColor="background"` |
| Color scale | `color="color11"` (high contrast text) |
| Responsive | `padding="4 sm:6"` |
| Variant | `<Button size="large" variant="outlined" />` |
| Animation | `transition="quick" opacity="1 enter:0"` |
| Theme switch | `<Theme name="dark"><Theme name="blue">` |
| Compound | `<Card><Card.Title>` with `createStyledContext` |

---

## Working in an Existing App

Rules learned from real production Tamagui codebases; follow them before
writing any component code:

1. **Use the project's wrapper layer, not raw Tamagui imports.** Most apps
   have their own Button, Dialog, Sheet, Popover, Menu, and Input wrappers
   (commonly under `interface/` or a design-system package) carrying product
   behavior: adapt breakpoints, haptics, hosted portal roots, focus handling.
   Importing the Tamagui compound component directly bypasses all of it.
   Search for the local wrapper first.
2. **Prop and spread order is semantic.** Later contributions replace only the
   base or exact clauses they restate. Never reorder `...props`, conditional
   spreads, variant props, or wrapper defaults during cleanup; destructuring
   and re-spreading can change which style wins.
3. **Know the token escape-hatch map** for values leaving the style system:
   `useTheme().token.val` for native modules and third-party APIs,
   `getTokenValue()` for numeric consumers, CSS `var(--token)` for SVG and raw
   DOM. Use these instead of hardcoding resolved values.
4. **Preserve commented workarounds.** Direct DOM listeners, class-based CSS
   for properties Tamagui cannot express, and geometry workarounds exist for
   measured reasons; removing them during unrelated work reintroduces bugs.
5. **Validate at runtime.** Flat values are broad string types, so a typo can
   typecheck. Rely on the language-service plugin and the
   `valid-flat-values` lint rule while writing, and verify hover/press/media/
   theme states in the running app for anything non-trivial.

---

## Migrating Existing Code

For a full v2 (or v1) app migration, use the dedicated `tamagui-upgrade-v3`
skill, which covers inventory, migration order, the flag playbook, hard-case
recipes, and platform validation. The core mechanics:

Use the flat-values codemod; do not add compatibility settings or runtime
fallbacks. Run it in report mode first, then write the full source corpus in one
pass:

```bash
npx @tamagui/codemod-flat-values --report /tmp/flat-values.md ./src
npx @tamagui/codemod-flat-values --write --report /tmp/flat-values.md ./src
```

The tool removes legacy token prefixes, folds condition objects into value
clauses, validates every emitted program, and reports the rows that need a hand
edit. Resolve every report row, then search the migrated source for old pseudo
property names and condition keys. V3 has no `legacyConditionObjects` setting,
dual lookup path, or compatibility shim.

---

## Resources

- Docs: https://tamagui.dev
- GitHub: https://github.com/tamagui/tamagui
- Discord: https://discord.gg/tamagui
