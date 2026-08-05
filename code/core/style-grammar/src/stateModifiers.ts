export const coreStateModifierNames: readonly string[] = Object.freeze([
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
