import type { ComponentType, FunctionComponent } from 'react'
import { jsx } from 'react/jsx-runtime'

import { setComponentDisplayName } from '../helpers/componentDisplayName'
import { DOMText } from './primitives.native'

/**
 * `html.*` on native without the compiler.
 *
 * The compiler is still the fast path: it resolves the tag, the element
 * defaults, the prop mapping and the literal-text wrapping at build time and
 * emits the primitive directly. When it did not run, the generated
 * `html.native.tsx` renders the same primitive through a regular Tamagui
 * component instead, and this module does the two things the primitives
 * deliberately do not do: mapping DOM props to their react native spelling, and
 * wrapping a raw string child of a view-backed tag in a text primitive.
 *
 * The result has to be what the compiler would have produced for the same
 * source, so every rule here is the runtime twin of one in `nativeDOMProps` in
 * `compilerHost.ts`, and the tables it reads are generated from the same
 * `@tamagui/dom` tables the compiler reads.
 *
 * Nothing here is reachable from a non-`.native` module, so the web bundle
 * never loads it.
 */

/** the table-derived mapping, generated into `html.native.tsx` */
export type DOMPropTables = {
  /** dom prop name to its react native spelling, when the two differ */
  renamed: Readonly<Record<string, string>>
  /** dom prop name to the nested accessibility object and key it becomes */
  nested: Readonly<Record<string, readonly [string, string]>>
  /** props the tables declare have no native equivalent, with their note */
  unsupportedProps: Readonly<Record<string, string>>
  /** events the tables declare have no native equivalent */
  unsupportedEvents: ReadonlySet<string>
  /** the `data-*` row's note, for any data prop other than data-testid */
  dataPropNote: string
  /** input types react native can render with a text-entry control */
  nativeInputTypes: ReadonlySet<string>
  /** what an authored `display: flex` means on native */
  flexDefaults: Readonly<Record<string, string | number>>
}

export type DOMTagSpec = {
  /** text and textinput backings resolve inherited text styles */
  inherits?: boolean
  /** a view backing cannot render a raw string, so literal children are wrapped */
  wrapsLiteralText?: boolean
  /** implicit aria role from the tag table */
  role?: string
  /** text-entry tag, which changes disabled, type and multiline handling */
  entry?: 'input' | 'textarea'
}

/**
 * A react native view renders no raw text, so a string or number child becomes
 * a text primitive that inherits the view's text styles. The compiler does this
 * for a static literal and reports a dynamic one; here the child's actual type
 * is known, so any string or number is wrapped.
 */
function wrapLiteralText(children: unknown): unknown {
  if (typeof children === 'string' || typeof children === 'number') {
    return jsx(DOMText, { __inherit: true, children })
  }
  if (!Array.isArray(children)) return children
  let wrapped: unknown[] | undefined
  for (let index = 0; index < children.length; index++) {
    const child = children[index]
    if (typeof child !== 'string' && typeof child !== 'number') continue
    wrapped ||= [...children]
    wrapped[index] = jsx(DOMText, { __inherit: true, children: child }, `text-${index}`)
  }
  return wrapped ?? children
}

function resolveDOMProps(
  props: Record<string, any>,
  tag: string,
  spec: DOMTagSpec,
  tables: DOMPropTables
) {
  const next: Record<string, any> = {}
  let nested: Record<string, Record<string, unknown>> | undefined
  let display: unknown
  let hidden = false
  let type: unknown
  let hasType = false
  let hasInputMode = false
  let hasRole = false

  for (const name in props) {
    const value = props[name]
    if (name === 'display') {
      display = value
      continue
    }
    if (name === 'hidden') {
      if (value) hidden = true
      continue
    }
    if (name === 'tabIndex') {
      next.focusable = value === 0
      continue
    }
    if (name === 'readOnly') {
      next.editable = !value
      continue
    }
    if (name === 'disabled') {
      next.disabled = value
      next.focusable = !value
      if (spec.entry) next.editable = !value
      nested ||= {}
      nested.accessibilityState = { ...nested.accessibilityState, disabled: value }
      continue
    }
    if (name === 'type') {
      type = value
      hasType = true
      continue
    }
    if (name === 'aria-hidden') {
      next.accessibilityElementsHidden = value
      next.importantForAccessibility = value ? 'no-hide-descendants' : 'auto'
      continue
    }
    if (name === 'aria-live') {
      next.accessibilityLiveRegion = value === 'off' ? 'none' : value
      continue
    }

    const target = tables.nested[name]
    if (target) {
      nested ||= {}
      nested[target[0]] = { ...nested[target[0]], [target[1]]: value }
      continue
    }

    if (tables.unsupportedEvents.has(name)) {
      throw new Error(`${name} has no native DOM event equivalent`)
    }
    const note =
      tables.unsupportedProps[name] ??
      (name.startsWith('data-') && name !== 'data-testid'
        ? tables.dataPropNote
        : undefined)
    if (note !== undefined) {
      throw new Error(`${name} is not supported on native html.${tag}: ${note}`)
    }
    if (name === 'onKeyDown' && !spec.entry) {
      throw new Error('onKeyDown requires a native text-entry control')
    }

    if (name === 'inputMode') hasInputMode = true
    else if (name === 'role') hasRole = true

    // onClick, onLoad, onError, onChange, onInput and onKeyDown are absent from
    // the rename table: the primitives adapt those payloads under the dom name
    next[tables.renamed[name] ?? name] = value
  }

  if (nested) Object.assign(next, nested)
  if (!hasRole && spec.role) next.role = spec.role
  if (spec.entry === 'textarea') next.multiline = true
  if (spec.entry === 'input' && hasType) {
    if (typeof type !== 'string' || !tables.nativeInputTypes.has(type)) {
      throw new Error(`input type ${String(type)} has no native text-entry control`)
    }
    if (type === 'password') next.secureTextEntry = true
    else if (type !== 'text' && !hasInputMode) {
      next.inputMode = type === 'number' ? 'numeric' : type
    }
  }

  // the compiler resolves hidden after every other prop, so it wins over an
  // authored display
  const resolvedDisplay = hidden ? 'none' : display
  if (resolvedDisplay !== undefined) next.display = resolvedDisplay

  // a ref needs the tag name to build its dom facade, and br has no children
  if (props.ref !== undefined || tag === 'br') next.__tag = tag
  if (spec.inherits) next.__inherit = true
  if (spec.wrapsLiteralText && next.children != null) {
    next.children = wrapLiteralText(next.children)
  }

  // an authored display:flex brings the css flex defaults with it, sitting
  // under the author's own props exactly as the compiler layers them
  return resolvedDisplay === 'flex' ? { ...tables.flexDefaults, ...next } : next
}

/**
 * Builds the `html.*` members from one shared set of generated tables, so a tag
 * costs a frame, a spec object and nothing else.
 */
export function createDOMTagFactory(tables: DOMPropTables) {
  return function domTag<Frame extends ComponentType<any>>(
    tag: string,
    Component: Frame,
    spec: DOMTagSpec = {}
  ): Frame {
    const Tag: FunctionComponent<Record<string, any>> = (props) =>
      jsx(Component, resolveDOMProps(props, tag, spec, tables))
    return setComponentDisplayName(Tag, tag) as unknown as Frame
  }
}

/**
 * A tag the tag table marks `native: 'none'`. The compiler reports it as a
 * build error; reaching one here means the compiler did not run, and rendering
 * an approximation of a control native does not have is what the DOM contract
 * exists to prevent.
 */
export function unsupportedDOMTag(tag: string, note: string) {
  const Tag: { (): never; displayName?: string } = () => {
    throw new Error(`html.${tag} is not supported on native: ${note}`)
  }
  return setComponentDisplayName(Tag, tag)
}
