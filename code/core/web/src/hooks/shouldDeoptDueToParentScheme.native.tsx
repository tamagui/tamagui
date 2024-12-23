import { Appearance } from 'react-native'
import type { ThemeManager } from '../helpers/ThemeManager'

// on iOS for fast scheme change, we assume the root theme name is matching the system
// but if any intermediate theme is "fixed" to light or dark, we need to opt out
// optimizing no-rerenders, because it could change by the end-user at any time in the tree
// but also theres no point in doing a dynamic color in the first place since scheme is fixed one way
export function shouldDeoptDueToParentScheme(manager?: ThemeManager) {
  // reverse so we get it from root => child (easier to check)
  const parents = (manager?.getParents() || []).reverse()
  const rootScheme = parents[0]?.state.scheme

  // de-opt because the root isn't light/dark
  if (!rootScheme) {
    return true
  }

  // de-opt if root scheme doesn't match system theme
  // TODO we could be smarter about this and still support fast scheme change
  // but we'd have to track the inverses which is a bit tricky
  if (Appearance.getColorScheme() !== rootScheme) {
    return true
  }

  // dont count the root theme level as fixed because it will be matching system theme
  let lastParentScheme = rootScheme

  // we want to return true if a scheme changes anywhere in the tree
  for (const parent of parents) {
    if (parent.state.scheme !== lastParentScheme) {
      return true
    }
    lastParentScheme = parent.state.scheme
  }

  return false
}
