import {
  getTokenCategoryName,
  propToTokenCategoryCode,
  tokenCategoryColor,
  tokenCategoryFontFamily,
  tokenCategoryFontSize,
  tokenCategoryFontWeight,
  tokenCategoryLetterSpacing,
  tokenCategoryLineHeight,
  tokenCategoryRadius,
  tokenCategorySize,
  tokenCategorySpace,
  tokenCategoryZIndex,
} from '@tamagui/helpers'

export type StyleTokenCategory = 'size' | 'space' | 'radius' | 'zIndex' | 'fontSize'
export type RuntimeTokenCategory = StyleTokenCategory | 'color' | 'font' | 'fontFamily'

const legacyCategory = (property: string): StyleTokenCategory | undefined => {
  const category = getTokenCategoryName(propToTokenCategoryCode[property])
  return category === 'space' ||
    category === 'size' ||
    category === 'radius' ||
    category === 'zIndex' ||
    category === 'fontSize'
    ? category
    : undefined
}

// compatibility view for internal consumers that enumerated the old string map.
// the proxy keeps the numeric table canonical and only allocates keys on enumeration
export const tokenCategoryByProperty: Readonly<Record<string, StyleTokenCategory>> =
  /* @__PURE__ */ new Proxy(Object.create(null), {
    get(_, property) {
      return typeof property === 'string' ? legacyCategory(property) : undefined
    },
    has(_, property) {
      return typeof property === 'string' && legacyCategory(property) !== undefined
    },
    ownKeys() {
      return Object.keys(propToTokenCategoryCode).filter(
        (property) => legacyCategory(property) !== undefined
      )
    },
    getOwnPropertyDescriptor(_, property) {
      if (typeof property !== 'string' || legacyCategory(property) === undefined) return
      return { configurable: true, enumerable: true }
    },
  })

export function getTokenCategoryForProperty(
  property: string
): RuntimeTokenCategory | undefined {
  switch (propToTokenCategoryCode[property]) {
    case tokenCategorySpace:
      return 'space'
    case tokenCategorySize:
      return 'size'
    case tokenCategoryRadius:
      return 'radius'
    case tokenCategoryZIndex:
      return 'zIndex'
    case tokenCategoryColor:
      return 'color'
    case tokenCategoryFontFamily:
      return 'fontFamily'
    case tokenCategoryFontSize:
    case tokenCategoryFontWeight:
    case tokenCategoryLineHeight:
    case tokenCategoryLetterSpacing:
      return 'font'
  }
}
