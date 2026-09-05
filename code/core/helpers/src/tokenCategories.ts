export * from '@tamagui/style-grammar/token-categories'

import {
  propToTokenCategoryCode,
  tokenCategoryNames,
} from '@tamagui/style-grammar/token-categories'

type TokenCategories = Record<
  'radius' | 'size' | 'zIndex' | 'color',
  Record<string, true>
>

// public compatibility view. each category materializes only when a caller reads it
export const tokenCategories = {} as TokenCategories
for (const category of ['radius', 'size', 'zIndex', 'color'] as const) {
  let view: Record<string, true> | undefined
  Object.defineProperty(tokenCategories, category, {
    enumerable: true,
    get() {
      if (view) return view
      view = {}
      const code = tokenCategoryNames.indexOf(category)
      for (const property in propToTokenCategoryCode) {
        if (propToTokenCategoryCode[property] === code) view[property] = true
      }
      return view
    },
  })
}
