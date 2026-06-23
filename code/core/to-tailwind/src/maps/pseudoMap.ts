import { media } from '@tamagui/config/v6'

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
  enterStyle: '', // no tailwind equivalent (mount animation)
  exitStyle: '', // no tailwind equivalent (unmount animation)
}

const mediaModifiers = new Set(Object.keys(media))

// v6 media names are tailwind modifier names:
// $sm -> sm:, $max-sm -> max-sm:, $height-md -> height-md:
export function mediaKeyToModifier(mediaKey: string): string | null {
  return mediaModifiers.has(mediaKey) ? mediaKey : null
}
