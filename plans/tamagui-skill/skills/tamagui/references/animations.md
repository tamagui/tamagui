# Animations Reference

The animation prop is `transition` (renamed from `animation` in v2). It takes
the name of a preset you configured, and drives whichever animation driver
your config carries.

## Animation Drivers

| Driver | Package | Best For |
|--------|---------|----------|
| CSS | `@tamagui/animations-css` | Web-only apps, smallest bundle |
| React Native | `@tamagui/animations-react-native` | Native apps, basic animations |
| Reanimated | `@tamagui/animations-reanimated` | Native apps, best performance |
| Motion | `@tamagui/animations-motion` | Cross-platform spring physics |

## Configuration

The v6 default config bundles no animations. Add a prebuilt preset set from a
`@tamagui/config` sub-entry, or define your own with `createAnimations`:

```tsx
import { defaultConfig } from '@tamagui/config/v6'
import { animationsCSS } from '@tamagui/config/animations-css'
// or: '@tamagui/config/animations-rn'
// or: '@tamagui/config/animations-reanimated'
// or: '@tamagui/config/animations-motion'

export const config = createTamagui({
  ...defaultConfig,
  animations: animationsCSS,
})
```

## Defining Animations

### CSS Driver

Uses CSS transition strings:

```tsx
import { createAnimations } from '@tamagui/animations-css'

const animations = createAnimations({
  fast: 'ease-in 150ms',
  medium: 'ease-in-out 300ms',
  slow: 'ease-out 500ms',
  bouncy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55) 400ms',
})
```

### Spring-Based Drivers (RN, Reanimated, Motion)

Use spring physics config:

```tsx
import { createAnimations } from '@tamagui/animations-react-native'

const animations = createAnimations({
  fast: {
    type: 'spring',
    damping: 20,
    stiffness: 300,
  },
  medium: {
    type: 'spring',
    damping: 15,
    stiffness: 200,
  },
  bouncy: {
    type: 'spring',
    damping: 8,
    mass: 0.8,
    stiffness: 100,
  },
})
```

## Using Animations

### Basic Animation

```tsx
<View
  transition="medium"
  opacity={isVisible ? 1 : 0}
  y={isVisible ? 0 : 10}
/>
```

### Enter/Exit Clauses

```tsx
<View
  transition="fast"
  opacity="1 enter:0 exit:0"
  y="0 enter:-20px exit:20px"
  scale="1 enter:0.9 exit:0.9"
/>
```

### AnimatePresence (Required for Exit)

Exit animations only work inside `AnimatePresence`:

```tsx
import { AnimatePresence } from 'tamagui'

<AnimatePresence>
  {show && (
    <View
      key="unique-key"  // key is required
      transition="medium"
      opacity="1 enter:0 exit:0"
    />
  )}
</AnimatePresence>
```

### Per-Property Transition

Override the transition for specific properties, or set distinct enter/exit
transitions. Both the array and object forms work:

```tsx
<View
  transition={[
    'fast',
    {
      opacity: { type: 'timing', duration: 500 },
      scale: { overshootClamping: true },
    },
  ]}
  opacity={1}
  scale={1}
/>

<View
  transition={{ default: 'fast', enter: 'medium', exit: 'quick', delay: 100 }}
/>
```

### Multiple Drivers

A config's `animations` can map several drivers (`{ default, css, spring }`);
pick per component with the `animatedBy` prop.

## Animatable Properties

Common animatable style properties:
- `opacity`
- `x`, `y` (translateX/Y)
- `scale`, `scaleX`, `scaleY`
- `rotate`, `rotateX`, `rotateY`, `rotateZ`
- `width`, `height`
- `backgroundColor`
- `borderColor`
- `borderRadius`

## Hover/Press States

State-based animations:

```tsx
<Button
  transition="fast"
  scale="1 hover:1.05 press:0.95"
  backgroundColor="background hover:blue-400 press:blue-600"
/>
```

## Animation with Variants

```tsx
const AnimatedCard = styled(View, {
  transition: 'medium',

  variants: {
    visible: {
      true: {
        opacity: 1,
        y: 0,
      },
      false: {
        opacity: 0,
        y: 20,
      },
    },
  } as const,
})

<AnimatedCard visible={isVisible} />
```

## Common Patterns

### Fade In

```tsx
<View
  transition="medium"
  opacity="1 enter:0"
/>
```

### Slide Up

```tsx
<View
  transition="fast"
  opacity="1 enter:0"
  y="0 enter:20px"
/>
```

### Scale In

```tsx
<View
  transition="bouncy"
  opacity="1 enter:0"
  scale="1 enter:0.8"
/>
```

### Modal Overlay

```tsx
<Dialog.Overlay
  transition="fast"
  opacity="0.5 enter:0 exit:0"
/>
```

### Modal Content

```tsx
<Dialog.Content
  transition={['medium', { opacity: { overshootClamping: true } }]}
  opacity="1 enter:0 exit:0"
  y="0 enter:-20px exit:10px"
  scale="1 enter:0.95 exit:0.98"
/>
```

## Tips

1. **Always provide key** in AnimatePresence children
2. **Put the base value first** in every clause-bearing style string
3. **Use overshootClamping** for opacity to prevent negative values
4. **CSS driver** doesn't support spring physics - use easing strings
5. **Test on device** - animation feel differs between web and native
