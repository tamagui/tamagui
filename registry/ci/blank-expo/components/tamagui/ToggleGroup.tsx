// Styled ToggleGroup = the unstyled @tamagui/ui ToggleGroup behavior + the
// default v2-look skin on its Item (theme palette, border, hover/press/focus
// color styling, the default active appearance) and the size table: a square
// hit target, the control height plus the skin's 1px border.
// Single skin definition; the shadcn registry item is generated from this file.
import {
  createRefComponent,
  type GetProps,
  styled,
  type TamaguiElement,
  withStaticProperties,
} from '@tamagui/core'
import { ToggleGroup as UiToggleGroup } from '@tamagui/toggle-group'
import type * as React from 'react'

export type ToggleGroupSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | boolean

const toggleGroupItemSize = {
  xs: { width: 26, height: 26, borderRadius: 'sm' },
  sm: { width: 34, height: 34, borderRadius: 'md' },
  md: { width: 38, height: 38, borderRadius: 'md' },
  lg: { width: 42, height: 42, borderRadius: 'md' },
  xl: { width: 50, height: 50, borderRadius: 'lg' },
} as const

export const ToggleGroupItem = styled(UiToggleGroup.Item, {
  displayName: 'ToggleGroupItem',
  // "on" swaps the item onto the brand theme rather than recoloring its
  // background, so the fill, the border and the icon (icons read theme.color,
  // they do not inherit CSS color) move together. Checkbox and Switch do the same.
  activeTheme: 'brand',
  backgroundColor: 'background hover:background-hover press:background-press',
  borderColor: 'border-color hover:border-color-hover press:border-color-press',
  borderWidth: 1,
  outlineColor: 'focus-visible:outline-color',
  outlineWidth: 'focus-visible:2px',
  outlineStyle: 'focus-visible:solid',
  zIndex: 'focus-visible:10',
  variants: {
    size: {
      ...toggleGroupItemSize,
      true: toggleGroupItemSize.md,
    },
  } as const,
  defaultVariants: {
    size: 'md',
  },
})

// see Dialog.tsx: withStaticProperties assigns in place, so composing onto
// UiToggleGroup would rewrite @tamagui/ui's own ToggleGroup.Item for every consumer
// of the unstyled package.
const ToggleGroupRoot = createRefComponent<
  TamaguiElement,
  React.ComponentProps<typeof UiToggleGroup>
>(function ToggleGroup(props, ref) {
  return <UiToggleGroup {...props} ref={ref} />
})

export const ToggleGroup = withStaticProperties(ToggleGroupRoot, {
  Item: ToggleGroupItem,
})

export type ToggleGroupItemProps = GetProps<typeof ToggleGroupItem>
