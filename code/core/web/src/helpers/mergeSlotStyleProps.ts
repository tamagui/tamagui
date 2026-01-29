import { composeRefs } from '@tamagui/compose-refs'
import { composeEventHandlers } from '@tamagui/helpers'

const isEventHandler = /^on[A-Z]/

/**
 * Merges props with special handling for style, className, ref, and event handlers.
 * Used by Slot and render prop implementations.
 *
 * @param base - Base props (typically from parent/slot)
 * @param overlay - Props to merge on top (typically from child/element)
 * @returns Merged props object (mutates and returns base for perf)
 */
export function mergeSlotStyleProps(
  base: Record<string, any>,
  overlay: Record<string, any>
): Record<string, any> {
  for (const key in overlay) {
    const baseVal = base[key]
    const overlayVal = overlay[key]

    if (overlayVal === undefined) continue

    if (key === 'style') {
      base.style =
        baseVal && overlayVal ? { ...baseVal, ...overlayVal } : overlayVal || baseVal
    } else if (key === 'className') {
      base.className =
        baseVal && overlayVal ? `${baseVal} ${overlayVal}` : overlayVal || baseVal
    } else if (key === 'ref') {
      base.ref =
        baseVal && overlayVal ? composeRefs(baseVal, overlayVal) : overlayVal || baseVal
    } else if (
      isEventHandler.test(key) &&
      typeof baseVal === 'function' &&
      typeof overlayVal === 'function'
    ) {
      base[key] = composeEventHandlers(baseVal, overlayVal)
    } else {
      // overlay wins for regular props
      base[key] = overlayVal
    }
  }

  return base
}
