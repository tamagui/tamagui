/**
 * maps tamagui pseudo-state prop names to tailwind modifier prefixes.
 */

export const pseudoToModifier: Record<string, string> = {
  hoverStyle: 'hover',
  pressStyle: 'active',
  focusStyle: 'focus',
  focusVisibleStyle: 'focus-visible',
  focusWithinStyle: 'focus-within',
  disabledStyle: 'disabled',
  // tamagui-own mount/unmount animation states — styleMode maps enter:/exit: colon
  // modifiers to enterStyle/exitStyle via the same machinery as hover:/active:.
  enterStyle: 'enter',
  exitStyle: 'exit',
}

// tamagui media key → tailwind breakpoint modifier
// tamagui uses max-width by default, tailwind uses min-width
// so $sm (max-width: 800) → max-sm:
// and $gtSm (min-width: 801) → sm:
export const mediaToModifier: Record<string, string> = {
  // max-width (tamagui default)
  xs: 'max-xs',
  sm: 'max-sm',
  md: 'max-md',
  lg: 'max-lg',
  xl: 'max-xl',
  xxs: 'max-[390px]',

  // min-width (gt variants)
  gtXs: 'xs',
  gtSm: 'sm',
  gtMd: 'md',
  gtLg: 'lg',
  gtXl: 'xl',
}
