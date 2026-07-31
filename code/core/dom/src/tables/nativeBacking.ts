import type { DefaultStyle, NativeBacking, NativeBackingRow, TagName } from './types'

/**
 * The native backing table: what each tag becomes after the DOM compiler runs.
 *
 * On native the compiler is required. Tag classification, primitive injection
 * and literal-text wrapping are build-time structural rewrites, so there is no
 * runtime child scan and no untransformed fallback: a missing compiler is a
 * native build failure.
 *
 * The block and flex constants below are the browser layout defaults React
 * Native does not have. The COMPILER applies them while flattening styles —
 * they depend on the parent's resolved display, which the compiler resolves
 * statically (same-module parent) or by the defined block-flow boundary rule
 * (component root). The primitives are hookless and apply nothing; see
 * `contract.ts` and plans/v3-dom-native-lowering-design.md.
 */

/** the module the compiler injects primitive imports from */
export const NATIVE_PRIMITIVE_MODULE = '@tamagui/core/dom'

const VIEW_TAGS: readonly TagName[] = [
  'article',
  'aside',
  'blockquote',
  'button',
  'div',
  'fieldset',
  'footer',
  'form',
  'header',
  'hr',
  'li',
  'main',
  'nav',
  'ol',
  'optgroup',
  'section',
  'select',
  'ul',
]

const TEXT_TAGS: readonly TagName[] = [
  'a',
  'b',
  'bdi',
  'bdo',
  'br',
  'code',
  'del',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'i',
  'ins',
  'kbd',
  'label',
  'mark',
  'option',
  'p',
  'pre',
  's',
  'span',
  'strong',
  'sub',
  'sup',
  'u',
]

export const NATIVE_BACKING: Readonly<Record<NativeBacking, NativeBackingRow>> = {
  view: {
    primitive: 'DOMView',
    host: 'View',
    tags: VIEW_TAGS,
    wrapsLiteralText: true,
    note: 'a direct literal string or number child is wrapped in DOMText at compile time, because a native view cannot render raw text',
  },
  text: {
    primitive: 'DOMText',
    host: 'Text',
    tags: TEXT_TAGS,
    wrapsLiteralText: false,
    note: 'inherits text styles from the nearest DOMText ancestor, and renders raw text directly',
  },
  image: {
    primitive: 'DOMImage',
    host: 'Image',
    tags: ['img'],
    wrapsLiteralText: false,
    note: 'width and height props become an aspect ratio so layout matches the browser before the image loads',
  },
  textinput: {
    primitive: 'DOMTextInput',
    host: 'TextInput',
    tags: ['input', 'textarea'],
    wrapsLiteralText: false,
    note: 'textarea sets multiline, and rows becomes numberOfLines',
  },
}

/** browser defaults every element has and react native does not */
export const NATIVE_ELEMENT_DEFAULTS: DefaultStyle = {
  boxSizing: 'content-box',
  position: 'static',
}

/** what `display: block` means once emulated on native */
export const NATIVE_BLOCK_DEFAULTS: DefaultStyle = {
  alignItems: 'stretch',
  display: 'flex',
  flexBasis: 'auto',
  flexDirection: 'column',
  flexShrink: 0,
  flexWrap: 'nowrap',
  justifyContent: 'flex-start',
}

/** what an authored `display: flex` means on native, matching css defaults */
export const NATIVE_FLEX_DEFAULTS: DefaultStyle = {
  alignContent: 'stretch',
  alignItems: 'stretch',
  flexBasis: 'auto',
  flexDirection: 'row',
  flexShrink: 1,
  flexWrap: 'nowrap',
  justifyContent: 'flex-start',
}
