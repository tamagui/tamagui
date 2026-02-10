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
export declare function getWebElement<T extends HTMLElement = HTMLElement>(
  element: TamaguiElement | null | undefined
): T
