// The prop -> token-category tables.
//
// Its own module because both `propMapper` and `directStyle` bind props to
// these categories, and `propMapper` needs `directStyle`'s condition resolver:
// leaving the tables where the resolver's consumer lives made the two files
// import each other.

import { tokenCategories } from '@tamagui/helpers'

export type StyleTokenCategory = 'size' | 'space' | 'radius' | 'zIndex' | 'fontSize'

function mapTokenCategory(keys: Record<string, boolean>, category: StyleTokenCategory) {
  return Object.fromEntries(Object.keys(keys).map((key) => [key, category]))
}

// exported so the flat-value grammar adapter binds props to the same token
// categories the bare-token path already uses, rather than keeping a second table
export const tokenCategoryByProperty: Record<string, StyleTokenCategory> = {
  ...mapTokenCategory(tokenCategories.size, 'size'),
  ...mapTokenCategory(tokenCategories.radius, 'radius'),
  ...mapTokenCategory(tokenCategories.zIndex, 'zIndex'),
  // the transform family's x/y are lengths from the space scale (v6 decision:
  // `x="4"` resolves like `p="4"`), never the size category
  x: 'space',
  y: 'space',
  fontSize: 'fontSize',
  borderWidth: 'space',
  borderTopWidth: 'space',
  borderRightWidth: 'space',
  borderBottomWidth: 'space',
  borderLeftWidth: 'space',
  borderBlockWidth: 'space',
  borderBlockStartWidth: 'space',
  borderBlockEndWidth: 'space',
  borderInlineWidth: 'space',
  borderInlineStartWidth: 'space',
  borderInlineEndWidth: 'space',
  outlineOffset: 'space',
  outlineWidth: 'space',
  gap: 'space',
  rowGap: 'space',
  columnGap: 'space',
  top: 'space',
  right: 'space',
  bottom: 'space',
  left: 'space',
  inset: 'space',
  insetBlock: 'space',
  insetBlockEnd: 'space',
  insetBlockStart: 'space',
  insetInline: 'space',
  insetInlineEnd: 'space',
  insetInlineStart: 'space',
  margin: 'space',
  marginBlock: 'space',
  marginBlockEnd: 'space',
  marginBlockStart: 'space',
  marginInline: 'space',
  marginInlineEnd: 'space',
  marginInlineStart: 'space',
  marginTop: 'space',
  marginRight: 'space',
  marginBottom: 'space',
  marginEnd: 'space',
  marginLeft: 'space',
  marginHorizontal: 'space',
  marginStart: 'space',
  marginVertical: 'space',
  padding: 'space',
  paddingBlock: 'space',
  paddingBlockEnd: 'space',
  paddingBlockStart: 'space',
  paddingInline: 'space',
  paddingInlineEnd: 'space',
  paddingInlineStart: 'space',
  paddingTop: 'space',
  paddingRight: 'space',
  paddingBottom: 'space',
  paddingEnd: 'space',
  paddingLeft: 'space',
  paddingHorizontal: 'space',
  paddingStart: 'space',
  paddingVertical: 'space',
}

export type RuntimeTokenCategory = StyleTokenCategory | 'color' | 'font' | 'fontFamily'

export function getTokenCategoryForProperty(
  property: string
): RuntimeTokenCategory | undefined {
  if (property === 'fontFamily') return 'fontFamily'
  if (
    property === 'fontSize' ||
    property === 'fontWeight' ||
    property === 'lineHeight' ||
    property === 'letterSpacing'
  ) {
    return 'font'
  }
  return (
    tokenCategoryByProperty[property] ||
    (property in tokenCategories.color ? 'color' : undefined)
  )
}
