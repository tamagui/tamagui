import { useContext } from 'react'

import {
  getInlineThemeLayer,
  getThemeProviderParent,
  ThemeStateContext,
  type InlineThemeLayer,
} from './useThemeState'
import { useThemeName } from './useThemeName'

export type PortalThemeState = {
  name: string
  /** Root-most first, so a consumer can replay them in authored order. */
  layers: InlineThemeLayer[]
}

/**
 * The theme state a portal must carry across the mount boundary.
 *
 * A name alone is not enough: `<Theme name="dark" background="#0b2545">` puts
 * its direct values on a CSS custom-property node in the mount ancestry, and
 * portaled content is not a descendant of that node.
 */
export function usePortalThemeState(): PortalThemeState {
  const name = useThemeName()
  const layers: InlineThemeLayer[] = []
  let cursor: string | undefined = useContext(ThemeStateContext)
  while (cursor) {
    const layer = getInlineThemeLayer(cursor)
    if (layer) layers.unshift(layer)
    cursor = getThemeProviderParent(cursor)
  }
  return { name, layers }
}
