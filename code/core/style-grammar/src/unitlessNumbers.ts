const unitlessNumberPropertyNames = [
  'animationIterationCount',
  'aspectRatio',
  'borderImageOutset',
  'borderImageSlice',
  'borderImageWidth',
  'boxFlex',
  'boxFlexGroup',
  'boxOrdinalGroup',
  'columnCount',
  'flex',
  'flexGrow',
  'flexOrder',
  'flexPositive',
  'flexShrink',
  'flexNegative',
  'fontWeight',
  'gap',
  'columnGap',
  'rowGap',
  'gridRow',
  'gridRowEnd',
  'gridRowGap',
  'gridRowStart',
  'gridColumn',
  'gridColumnEnd',
  'gridColumnGap',
  'gridColumnStart',
  'lineClamp',
  'opacity',
  'order',
  'orphans',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',
  'fillOpacity',
  'floodOpacity',
  'stopOpacity',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeMiterlimit',
  'strokeOpacity',
  'strokeWidth',
  'scale',
  'scaleX',
  'scaleY',
  'scaleZ',
  'shadowOpacity',
] as const

// Mirrored from react-native-web-internals/src/modules/unitlessNumbers/index.tsx;
// this package cannot import across that runtime boundary.
const unitlessNumbers = new Set<string>(unitlessNumberPropertyNames)
for (const prefix of ['ms', 'Moz', 'O', 'Webkit']) {
  for (const property of unitlessNumberPropertyNames) {
    unitlessNumbers.add(prefix + property[0].toUpperCase() + property.slice(1))
  }
}

export const unitlessNumberProperties: ReadonlySet<string> = unitlessNumbers
