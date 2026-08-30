export type StyleTokenCategory = 'size' | 'space' | 'radius' | 'zIndex' | 'fontSize'
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
  if (property === 'zIndex') return 'zIndex'
  if (property === 'color' || property.endsWith('Color')) return 'color'
  if (property.endsWith('Radius')) {
    return property === 'shadowRadius' ? 'size' : 'radius'
  }
  if (
    /^(?:width|height|(?:min|max)(?:Width|Height))$/.test(property) ||
    property.endsWith('BlockSize') ||
    property.endsWith('InlineSize') ||
    property === 'blockSize' ||
    property === 'inlineSize'
  ) {
    return 'size'
  }
  if (
    property === 'x' ||
    property === 'y' ||
    property === 'top' ||
    property === 'right' ||
    property === 'bottom' ||
    property === 'left' ||
    property === 'outlineOffset' ||
    property === 'gap' ||
    property.endsWith('Gap') ||
    property.startsWith('margin') ||
    property.startsWith('padding') ||
    property.startsWith('inset') ||
    ((property.startsWith('border') || property === 'outlineWidth') &&
      property.endsWith('Width'))
  ) {
    return 'space'
  }
}
