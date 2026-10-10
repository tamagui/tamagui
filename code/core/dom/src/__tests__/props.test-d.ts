/**
 * Type tests for the generated strict DOM prop interfaces.
 *
 * These are checked by `bun run test:types` (tsc), not by vitest: every
 * `@ts-expect-error` below fails the build the moment the error it expects
 * stops happening, which is what makes the negative cases real. The positive
 * cases fail the build if the prop stops being accepted.
 */

import type {
  AriaRole,
  AutoComplete,
  InputType,
  StrictDOMAnchorProps,
  StrictDOMButtonProps,
  StrictDOMImageProps,
  StrictDOMInputProps,
  StrictDOMLabelProps,
  StrictDOMListItemProps,
  StrictDOMOptionProps,
  StrictDOMProps,
  StrictDOMPropsByTag,
  StrictDOMSelectProps,
  StrictDOMTextAreaProps,
  StrictDOMVoidProps,
} from '../props'

declare const accept: <T>(props: T) => void

// element-specific props reach the element that owns them
accept<StrictDOMAnchorProps>({
  href: 'https://tamagui.dev',
  target: '_blank',
  rel: 'noreferrer',
})
accept<StrictDOMButtonProps>({ type: 'submit', disabled: true })
accept<StrictDOMImageProps>({
  src: 'a.png',
  alt: 'a',
  width: 10,
  height: 10,
  loading: 'lazy',
})
accept<StrictDOMInputProps>({
  type: 'password',
  value: 'x',
  placeholder: 'p',
  maxLength: 3,
})
accept<StrictDOMLabelProps>({ for: 'field' })
accept<StrictDOMListItemProps>({ value: 3 })
accept<StrictDOMOptionProps>({ value: 'a', label: 'A' })
accept<StrictDOMSelectProps>({ value: ['a', 'b'], multiple: true })
accept<StrictDOMTextAreaProps>({ rows: 4, defaultValue: 'x' })

// and are rejected on elements that do not
// @ts-expect-error href belongs to an anchor
accept<StrictDOMProps>({ href: 'https://tamagui.dev' })
// @ts-expect-error src belongs to an image
accept<StrictDOMProps>({ src: 'a.png' })
// @ts-expect-error for belongs to a label
accept<StrictDOMProps>({ for: 'field' })
// @ts-expect-error rows belongs to a textarea
accept<StrictDOMInputProps>({ rows: 4 })
// @ts-expect-error a button takes no href
accept<StrictDOMButtonProps>({ href: 'https://tamagui.dev' })

// the per-element value narrowings are real narrowings
// @ts-expect-error a list item counter is a number
accept<StrictDOMListItemProps>({ value: '3' })
// @ts-expect-error only a select takes several values
accept<StrictDOMInputProps>({ value: ['a', 'b'] })
// @ts-expect-error a button is not an input, so it has no text input types
accept<StrictDOMButtonProps>({ type: 'password' })
// @ts-expect-error submit is a button type and an input type, reset is neither
accept<StrictDOMButtonProps>({ type: 'reset' })

// aria props and their value sets
accept<StrictDOMProps>({ 'aria-label': 'x', 'aria-hidden': true, 'aria-level': 2 })
accept<StrictDOMProps>({ 'aria-checked': 'mixed', role: 'button' })
// @ts-expect-error aria-level is a number
accept<StrictDOMProps>({ 'aria-level': 'two' })
// @ts-expect-error deprecated and abstract roles are not offered
accept<StrictDOMProps>({ role: 'widget' })
// @ts-expect-error aria props are spelled in full, never guessed
accept<StrictDOMProps>({ 'aria-labeled-by': 'x' })

// data-* passes through, and data-testid keeps its narrower type
accept<StrictDOMProps>({ 'data-testid': 'x', 'data-anything': 1, 'data-flag': true })
// @ts-expect-error data-testid is a string, not a number
accept<StrictDOMProps>({ 'data-testid': 1 })

// capture-phase props are not part of strict DOM, on any element
// @ts-expect-error no capture-phase props
accept<StrictDOMProps>({ onKeyDownCapture: () => {} })
// @ts-expect-error no capture-phase props
accept<StrictDOMProps>({ onWheelCapture: () => {} })
// @ts-expect-error no capture-phase props
accept<StrictDOMButtonProps>({ onClickCapture: () => {} })

// event payloads are the cross-platform subset
accept<StrictDOMProps>({ onClick: (event) => event.pageX })
accept<StrictDOMProps>({ onKeyDown: (event) => event.key })
accept<StrictDOMInputProps>({ onChange: (event) => event.target.value })
accept<StrictDOMImageProps>({ onLoad: (event) => event.target.naturalWidth })
// @ts-expect-error a click event carries no key
accept<StrictDOMProps>({ onClick: (event) => event.key })
// @ts-expect-error a pass-through handler promises no shape
accept<StrictDOMProps>({ onFocus: (event) => event.target })

// the content model decides what children a tag takes
accept<StrictDOMProps>({ children: 'text' })
accept<StrictDOMVoidProps>({})
// @ts-expect-error a void element takes no children
accept<StrictDOMVoidProps>({ children: 'text' })
// @ts-expect-error an image takes no children
accept<StrictDOMImageProps>({ children: 'text' })
// @ts-expect-error a textarea's value comes from value or defaultValue
accept<StrictDOMTextAreaProps>({ children: 'text' })
accept<StrictDOMOptionProps>({ children: 'text' })
// @ts-expect-error an option holds text, not elements
accept<StrictDOMOptionProps>({ children: {} as JSX.Element })

// the tag map routes each tag to the interface its element really has. Every
// prop is optional, so the interfaces are mutually assignable and only a fresh
// object literal proves anything: this is the shape a typed `html.*` will use.
declare const forTag: <K extends keyof StrictDOMPropsByTag>(
  tag: K,
  props: StrictDOMPropsByTag[K]
) => void

forTag('a', { href: 'https://tamagui.dev' })
// @ts-expect-error a div is not an anchor
forTag('div', { href: 'https://tamagui.dev' })
forTag('br', {})
// @ts-expect-error br is a void element
forTag('br', { children: 'text' })
forTag('li', { value: 3 })
// @ts-expect-error a list counter is a number
forTag('li', { value: '3' })
forTag('input', { type: 'email' })
// @ts-expect-error email is an input type, not a button type
forTag('button', { type: 'email' })

// the value unions are exported for authors to reference
accept<AriaRole>('listitem')
accept<AutoComplete>('one-time-code')
accept<InputType>('datetime-local')
// @ts-expect-error not an html input type
accept<InputType>('richtext')
