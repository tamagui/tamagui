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
export function getWebElement(element) {
  if (!element) {
    throw new Error('Element is null or undefined')
  }
  if (!(element instanceof HTMLElement)) {
    throw new Error('Element is not an HTMLElement')
  }
  return element
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0V2ViRWxlbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdldFdlYkVsZW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBTSxVQUFVLGFBQWEsQ0FDM0IsT0FBMEM7SUFFMUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO0lBQ2pELENBQUM7SUFDRCxJQUFJLENBQUMsQ0FBQyxPQUFPLFlBQVksV0FBVyxDQUFDLEVBQUUsQ0FBQztRQUN0QyxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUE7SUFDbEQsQ0FBQztJQUNELE9BQU8sT0FBdUIsQ0FBQTtBQUNoQyxDQUFDIn0=
