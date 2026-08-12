export type CoreStateModifierName =
  | 'hover'
  | 'press'
  | 'focus'
  | 'focus-visible'
  | 'focus-within'
  | 'disabled'
  | 'enter'
  | 'exit'

export const coreStateModifierNames: readonly CoreStateModifierName[] = Object.freeze([
  'hover',
  'press',
  'focus',
  'focus-visible',
  'focus-within',
  'disabled',
  'enter',
  'exit',
])

export const modifierAliases: Readonly<Record<string, string>> = Object.freeze({
  active: 'press',
})
