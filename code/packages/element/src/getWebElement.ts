import type { TamaguiElement } from './types'

/**
 * Narrows a TamaguiElement to an HTMLElement, with optional generic for further casting.
 * Throws if the element is not an instanceof HTMLElement.
 *
 * @example
 * ```tsx
 * const el = getWebElement(ref.current) // HTMLElement
 * const input = getWebElement<HTMLInputElement>(ref.current) // HTMLInputElement
 * ```
 */
export function getWebElement<T extends HTMLElement = HTMLElement>(
  element: TamaguiElement | null | undefined
): T {
  if (!element) {
    throw new Error('Element is null or undefined')
  }
  if (!(element instanceof HTMLElement)) {
    throw new Error('Element is not an HTMLElement')
  }
  return element as unknown as T
}
