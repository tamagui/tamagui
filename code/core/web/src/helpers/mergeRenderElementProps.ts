import { composeRefs } from '@tamagui/compose-refs'

/**
 * Merges props from a render element with viewProps from Tamagui.
 * Handles special merging for styles, classNames, event handlers, and refs.
 */
export function mergeRenderElementProps(
  elementProps: Record<string, any>,
  viewProps: Record<string, any>,
  children: any
): Record<string, any> {
  const merged: Record<string, any> = { ...viewProps }

  for (const key in elementProps) {
    const elementValue = elementProps[key]
    const viewValue = viewProps[key]

    if (key === 'style') {
      // Merge styles: viewProps style takes precedence
      merged.style = elementValue
        ? viewValue
          ? { ...elementValue, ...viewValue }
          : elementValue
        : viewValue
    } else if (key === 'className') {
      // Concatenate classNames
      merged.className = viewValue
        ? elementValue
          ? `${elementValue} ${viewValue}`
          : viewValue
        : elementValue
    } else if (key === 'ref') {
      // Compose refs
      merged.ref = viewValue ? composeRefs(elementValue, viewValue) : elementValue
    } else if (typeof elementValue === 'function' && typeof viewValue === 'function') {
      // Compose event handlers
      merged[key] = (...args: any[]) => {
        elementValue(...args)
        viewValue(...args)
      }
    } else if (viewValue === undefined) {
      // Use element's value if viewProps doesn't have it
      merged[key] = elementValue
    }
    // Otherwise viewProps value takes precedence (already in merged)
  }

  // Set children
  merged.children = children

  return merged
}
