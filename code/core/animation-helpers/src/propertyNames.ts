// which css property a tamagui style key animates under.
//
// this is a module of its own, with no imports, because `@tamagui/web` needs
// it on every styled component while the parser and the spring solver in
// `resolveTransition` are only needed when a driver is in the bundle.

/**
 * transform parts map onto the css property that actually animates them.
 * `translate`, `scale`, and `rotate` are real individual transform properties;
 * everything else can only be reached through `transform` as a whole.
 *
 * collapsing here is deliberate. css cannot animate `rotateX` separately from
 * `skewY` (both live in `transform`), so letting a js driver do it would be a
 * capability that silently disappears the moment you build for the web.
 */
const transformProperties: Record<string, string> = {
  x: 'translate',
  y: 'translate',
  z: 'translate',
  translate: 'translate',
  translateX: 'translate',
  translateY: 'translate',
  translateZ: 'translate',
  scale: 'scale',
  scaleX: 'scale',
  scaleY: 'scale',
  scaleZ: 'scale',
  rotate: 'rotate',
  rotateX: 'transform',
  rotateY: 'transform',
  rotateZ: 'transform',
  skewX: 'transform',
  skewY: 'transform',
  perspective: 'transform',
  matrix: 'transform',
  transform: 'transform',
}

/**
 * the css property name an entry is filed under, so `backgroundColor` and
 * `background-color` are one key and cannot both silently apply.
 */
export function canonicalTransitionProperty(key: string): string {
  if (key === 'all' || key === 'none') return key
  const transform = transformProperties[key]
  if (transform) return transform
  return key.includes('-') ? key : key.replace(/[A-Z]/g, '-$&').toLowerCase()
}

export function isTransformProperty(key: string): boolean {
  return key in transformProperties
}

const styleKeysByProperty: Record<string, readonly string[]> = {
  translate: ['translate', 'translateX', 'translateY', 'translateZ', 'x', 'y', 'z'],
  scale: ['scale', 'scaleX', 'scaleY', 'scaleZ'],
  rotate: ['rotate'],
  transform: [
    'transform',
    'rotateX',
    'rotateY',
    'rotateZ',
    'skewX',
    'skewY',
    'perspective',
    'matrix',
  ],
}

/**
 * the style keys a css property covers, for drivers that key their per-property
 * options by style key rather than css property (motion, react-native).
 */
export function styleKeysForProperty(property: string): readonly string[] {
  const transform = styleKeysByProperty[property]
  if (transform) return transform
  return [property.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())]
}
